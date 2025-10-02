import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { S3ImageUploader } from "@/components/admin/S3ImageUploader";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import type { LeadershipPeriod } from "@shared/schema";

const formSchema = z.object({
  year: z.string().min(1, "Year is required"),
  jefatura: z.string().min(1, "Jefatura is required"),
  segundaVoz: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});

type FormData = z.infer<typeof formSchema>;

export default function AdminJefaturas() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<LeadershipPeriod | null>(null);

  const { data: periods, isLoading } = useQuery<LeadershipPeriod[]>({
    queryKey: ["/api/admin/leadership"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: "",
      jefatura: "",
      segundaVoz: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("POST", "/api/admin/leadership", {
        year: data.year,
        jefatura: data.jefatura,
        segundaVoz: data.segundaVoz || null,
        imageUrl: data.imageUrl || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leadership"] });
      toast({
        title: "Jefatura creada",
        description: "La jefatura se ha creado correctamente.",
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
      return apiRequest("PUT", `/api/admin/leadership/${id}`, {
        year: data.year,
        jefatura: data.jefatura,
        segundaVoz: data.segundaVoz || null,
        imageUrl: data.imageUrl || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leadership"] });
      toast({
        title: "Jefatura actualizada",
        description: "La jefatura se ha actualizado correctamente.",
      });
      setDialogOpen(false);
      setEditingPeriod(null);
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
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/leadership/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leadership"] });
      toast({
        title: "Jefatura eliminada",
        description: "La jefatura se ha eliminado correctamente.",
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
    if (editingPeriod) {
      updateMutation.mutate({ id: editingPeriod.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (period: LeadershipPeriod) => {
    setEditingPeriod(period);
    form.reset({
      year: period.year,
      jefatura: period.jefatura,
      segundaVoz: period.segundaVoz || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar esta jefatura?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingPeriod(null);
      form.reset();
    }
    setDialogOpen(open);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-full" />
              </CardHeader>
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
            Jefaturas
          </h1>
          <p className="text-muted-foreground">
            Administre los periodos de jefatura del Cuerpo de Banderas
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-leadership">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Jefatura
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPeriod ? "Editar Jefatura" : "Nueva Jefatura"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Año</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="1951" data-testid="input-year" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jefatura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jefatura</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nombre del jefe" data-testid="input-jefatura" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="segundaVoz"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Segunda Voz (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          placeholder="Nombre del segunda voz"
                          data-testid="input-segunda-voz"
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
                      <FormLabel>Fotografía (opcional)</FormLabel>
                      <FormControl>
                        <S3ImageUploader
                          onUploadComplete={(url) => field.onChange(url)}
                          currentImageUrl={editingPeriod?.imageUrl || undefined}
                          onRemove={() => field.onChange(null)}
                          folder="leadership"
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
                      : editingPeriod
                      ? "Actualizar"
                      : "Crear"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {periods?.map((period) => (
          <Card key={period.id} data-testid={`card-leadership-${period.id}`}>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl">{period.year}</CardTitle>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Jefatura:</span> {period.jefatura}
                    </p>
                    {period.segundaVoz && (
                      <p className="text-sm">
                        <span className="font-medium">Segunda Voz:</span> {period.segundaVoz}
                      </p>
                    )}
                  </div>
                </div>
                {period.imageUrl && (
                  <div className="w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={period.imageUrl}
                      alt={`${period.year} - ${period.jefatura}`}
                      className="w-full h-full object-cover"
                      data-testid={`img-leadership-${period.id}`}
                    />
                  </div>
                )}
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(period)}
                    data-testid={`button-edit-${period.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(period.id)}
                    data-testid={`button-delete-${period.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {periods?.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay jefaturas registradas</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
