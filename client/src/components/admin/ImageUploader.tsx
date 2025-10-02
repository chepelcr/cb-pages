import { useState, useRef, DragEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  currentImageUrl?: string;
  onRemove?: () => void;
  maxSizeMB?: number;
  accept?: string;
  className?: string;
}

export function ImageUploader({
  onImageSelect,
  currentImageUrl,
  onRemove,
  maxSizeMB = 10,
  accept = 'image/*',
  className = '',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccione solo archivos de imagen');
      return;
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`El archivo es demasiado grande. Máximo ${maxSizeMB}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Call parent handler
    onImageSelect(file);
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
    fileInputRef.current?.click();
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
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
          data-testid="card-upload-zone"
        >
          <div className="aspect-video w-full flex flex-col items-center justify-center gap-4 p-8">
            <div className="rounded-full bg-muted p-6">
              {isDragging ? (
                <Upload className="h-8 w-8 text-primary" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium" data-testid="text-upload-instruction">
                {isDragging
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
