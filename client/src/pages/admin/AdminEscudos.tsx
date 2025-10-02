import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, Shield as ShieldIcon } from "lucide-react";
import type { Shield } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  symbolism: z.string().optional().nullable(),
  imageFile: z.instanceof(File).optional().nullable(),
  isMainShield: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export default function AdminEscudos() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingShield, setEditingShield] = useState<Shield | null>(null);

  const { data: shields, isLoading } = useQuery<Shield[]>({
    queryKey: ["/api/admin/shields"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      symbolism: "",
      isMainShield: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.symbolism) formData.append("symbolism", data.symbolism);
      formData.append("isMainShield", String(data.isMainShield));
      if (data.imageFile) formData.append("image", data.imageFile);

      const res = await fetch("/api/admin/shields", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text()}`);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shields"] });
      toast({
        title: "Escudo creado",
        description: "El escudo se ha creado correctamente.",
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
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.symbolism) formData.append("symbolism", data.symbolism);
      formData.append("isMainShield", String(data.isMainShield));
      if (data.imageFile) formData.append("image", data.imageFile);

      const res = await fetch(`/api/admin/shields/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text()}`);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shields"] });
      toast({
        title: "Escudo actualizado",
        description: "El escudo se ha actualizado correctamente.",
      });
      setDialogOpen(false);
      setEditingShield(null);
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
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/shields/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shields"] });
      toast({
        title: "Escudo eliminado",
        description: "El escudo se ha eliminado correctamente.",
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

  const setMainShieldMutation = useMutation({
    mutationFn: (id: string) => apiRequest("PUT", `/api/admin/shields/${id}/set-main`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shields"] });
      toast({
        title: "Escudo principal actualizado",
        description: "El escudo principal se ha actualizado correctamente.",
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
    if (editingShield) {
      updateMutation.mutate({ id: editingShield.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (shield: Shield) => {
    setEditingShield(shield);
    form.reset({
      title: shield.title,
      description: shield.description,
      symbolism: shield.symbolism || "",
      isMainShield: shield.isMainShield || false,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar este escudo?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingShield(null);
      form.reset();
    }
    setDialogOpen(open);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            Escudos
          </h1>
          <p className="text-muted-foreground">
            Administre los escudos del Cuerpo de Banderas
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-shield">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Escudo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingShield ? "Editar Escudo" : "Nuevo Escudo"}
              </DialogTitle>
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
                        <Input {...field} data-testid="input-title" />
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
                        <Textarea {...field} rows={3} data-testid="input-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="symbolism"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Simbolismo (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          rows={3}
                          data-testid="input-symbolism"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isMainShield"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-is-main-shield"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Establecer como escudo principal
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagen</FormLabel>
                      <FormControl>
                        <ImageUploader
                          onImageSelect={(file) => field.onChange(file)}
                          currentImageUrl={editingShield?.imageUrl || undefined}
                          onRemove={() => field.onChange(null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
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
                    data-testid="button-submit"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Guardando..."
                      : editingShield
                      ? "Actualizar"
                      : "Crear"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shields?.map((shield) => (
          <Card key={shield.id} data-testid={`card-shield-${shield.id}`}>
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg">{shield.title}</CardTitle>
                  {shield.isMainShield && (
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <ShieldIcon className="h-3 w-3" />
                      Escudo Principal
                    </CardDescription>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(shield)}
                    data-testid={`button-edit-${shield.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(shield.id)}
                    data-testid={`button-delete-${shield.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {shield.imageUrl && (
                <div className="aspect-square w-full bg-muted rounded-md overflow-hidden">
                  <img
                    src={shield.imageUrl}
                    alt={shield.title}
                    className="w-full h-full object-contain"
                    data-testid={`img-shield-${shield.id}`}
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {shield.description}
              </p>
              {!shield.isMainShield && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => setMainShieldMutation.mutate(shield.id)}
                  disabled={setMainShieldMutation.isPending}
                  data-testid={`button-set-main-${shield.id}`}
                >
                  Establecer como Principal
                </Button>
              )}
            </CardContent>
          </Card>
        ))}

        {shields?.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShieldIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay escudos registrados</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
