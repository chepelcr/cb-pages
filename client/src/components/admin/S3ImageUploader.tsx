import { useState, useRef, DragEvent } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface S3ImageUploaderProps {
  onUploadComplete: (publicUrl: string) => void;
  currentImageUrl?: string;
  onRemove?: () => void;
  maxSizeMB?: number;
  accept?: string;
  className?: string;
  folder?: string;
}

export function S3ImageUploader({
  onUploadComplete,
  currentImageUrl,
  onRemove,
  maxSizeMB = 10,
  accept = 'image/*',
  className = '',
  folder = 'uploads',
}: S3ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Por favor seleccione solo archivos de imagen',
        variant: 'destructive',
      });
      return;
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: 'Error',
        description: `El archivo es demasiado grande. Máximo ${maxSizeMB}MB`,
        variant: 'destructive',
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to S3 via presigned URL
    await uploadToS3(file);
  };

  const uploadToS3 = async (file: File) => {
    setIsUploading(true);
    try {
      // Step 1: Get presigned URL from backend
      const presignResponse = await fetch('/api/uploads/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fileType: file.type,
          folder,
        }),
      });

      if (!presignResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, publicUrl } = await presignResponse.json();

      // Step 2: Upload file directly to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      // Step 3: Notify parent component of successful upload
      onUploadComplete(publicUrl);

      toast({
        title: 'Éxito',
        description: 'Imagen subida correctamente',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Error al subir la imagen. Por favor intente de nuevo.',
        variant: 'destructive',
      });
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        data-testid="input-image-file"
        disabled={isUploading}
      />

      {preview ? (
        <Card className="relative overflow-hidden" data-testid="card-image-preview">
          <div className="aspect-video w-full bg-muted flex items-center justify-center">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
              data-testid="img-preview"
            />
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-white">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm">Subiendo imagen...</p>
              </div>
            </div>
          )}
          {!isUploading && (
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                size="icon"
                variant="destructive"
                onClick={handleRemove}
                data-testid="button-remove-image"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
          data-testid="card-upload-zone"
        >
          <div className="aspect-video w-full flex flex-col items-center justify-center gap-4 p-8">
            <div className="rounded-full bg-muted p-6">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : isDragging ? (
                <Upload className="h-8 w-8 text-primary" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium" data-testid="text-upload-instruction">
                {isUploading
                  ? 'Subiendo imagen...'
                  : isDragging
                  ? 'Suelte la imagen aquí'
                  : 'Arrastre una imagen o haga clic para seleccionar'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Máximo {maxSizeMB}MB
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
