import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { S3ImageUploader } from "@/components/S3ImageUploader";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import type { HistoricalImage } from "@shared/schema";

const formSchema = z.object({
  title: z.string().min(1, "Título es requerido"),
  description: z.string().min(1, "Descripción es requerida"),
  imageUrl: z.string().min(1, "Imagen es requerida"),
  imageS3Key: z.string().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function AdminHistoricalImages() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<HistoricalImage | null>(null);

  const { data: images, isLoading } = useQuery<HistoricalImage[]>({
    queryKey: ["/api/admin/historical-images"],
  });

  const sortedImages = images?.sort((a, b) => a.displayOrder - b.displayOrder) || [];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      imageS3Key: "",
      displayOrder: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("POST", "/api/admin/historical-images", {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        imageS3Key: data.imageS3Key || null,
        displayOrder: data.displayOrder || 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/historical-images"] });
      toast({
        title: "Imagen creada",
        description: "La imagen histórica se ha creado correctamente.",
      });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      return apiRequest("PUT", `/api/admin/historical-images/${id}`, {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        imageS3Key: data.imageS3Key || null,
        displayOrder: data.displayOrder || 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/historical-images"] });
      toast({
        title: "Imagen actualizada",
        description: "La imagen histórica se ha actualizado correctamente.",
      });
      setDialogOpen(false);
      setEditingImage(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/historical-images/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/historical-images"] });
      toast({
        title: "Imagen eliminada",
        description: "La imagen histórica se ha eliminado correctamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (editingImage) {
      updateMutation.mutate({ id: editingImage.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (image: HistoricalImage) => {
    setEditingImage(image);
    form.reset({
      title: image.title,
      description: image.description,
      imageUrl: image.imageUrl,
      imageS3Key: image.imageS3Key || "",
      displayOrder: image.displayOrder,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar esta imagen histórica?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingImage(null);
      form.reset();
    }
    setDialogOpen(open);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Imágenes Históricas</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las imágenes históricas del Cuerpo de Banderas
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-image">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Imagen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? "Editar Imagen Histórica" : "Nueva Imagen Histórica"}
              </DialogTitle>
              <DialogDescription>
                {editingImage 
                  ? "Modifica los detalles de la imagen histórica." 
                  : "Agrega una nueva imagen histórica con su descripción."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Primeras Ceremonias"
                          data-testid="input-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          placeholder="Imágenes históricas de las primeras ceremonias..."
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagen</FormLabel>
                      <FormControl>
                        <S3ImageUploader
                          onUploadComplete={(url, fileKey) => {
                            field.onChange(url);
                            if (fileKey) {
                              form.setValue('imageS3Key', fileKey);
                            }
                          }}
                          currentImageUrl={field.value}
                          onRemove={() => {
                            field.onChange("");
                            form.setValue('imageS3Key', "");
                          }}
                          folder="historical"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orden de Visualización</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          placeholder="0"
                          data-testid="input-display-order"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDialogClose(false)}
                    data-testid="button-cancel"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Guardando..."
                      : editingImage
                      ? "Actualizar"
                      : "Crear"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-80 w-full" />
          ))}
        </div>
      ) : sortedImages.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No hay imágenes históricas
          </h3>
          <p className="text-muted-foreground mb-4">
            Comienza agregando tu primera imagen histórica
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedImages.map((image) => (
            <Card key={image.id} className="overflow-hidden" data-testid={`card-image-${image.id}`}>
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-48 object-cover"
                data-testid={`img-${image.id}`}
              />
              <CardHeader>
                <CardTitle className="text-lg" data-testid={`text-title-${image.id}`}>
                  {image.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground" data-testid={`text-description-${image.id}`}>
                  {image.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(image)}
                    data-testid={`button-edit-${image.id}`}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${image.id}`}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
