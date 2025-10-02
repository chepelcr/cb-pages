import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, Flag, Users, Award, Calendar as CalendarIcon } from "lucide-react";
import type { HistoricalMilestone } from "@shared/schema";

const iconOptions = [
  { value: "Flag", label: "Bandera", icon: Flag },
  { value: "Users", label: "Personas", icon: Users },
  { value: "Award", label: "Premio", icon: Award },
  { value: "Calendar", label: "Calendario", icon: CalendarIcon },
];

const formSchema = z.object({
  year: z.string().min(1, "Year is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  iconName: z.enum(["Flag", "Users", "Award", "Calendar"]).default("Flag"),
});

type FormData = z.infer<typeof formSchema>;

export default function AdminHistoria() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<HistoricalMilestone | null>(null);

  const { data: milestones, isLoading } = useQuery<HistoricalMilestone[]>({
    queryKey: ["/api/admin/history"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: "",
      title: "",
      description: "",
      iconName: "Flag",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("POST", "/api/admin/history", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/history"] });
      toast({
        title: "Hito creado",
        description: "El hito histórico se ha creado correctamente.",
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
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      apiRequest("PUT", `/api/admin/history/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/history"] });
      toast({
        title: "Hito actualizado",
        description: "El hito histórico se ha actualizado correctamente.",
      });
      setDialogOpen(false);
      setEditingMilestone(null);
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
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/history/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/history"] });
      toast({
        title: "Hito eliminado",
        description: "El hito histórico se ha eliminado correctamente.",
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
    if (editingMilestone) {
      updateMutation.mutate({ id: editingMilestone.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (milestone: HistoricalMilestone) => {
    setEditingMilestone(milestone);
    form.reset({
      year: milestone.year,
      title: milestone.title,
      description: milestone.description,
      iconName: milestone.iconName as "Flag" | "Users" | "Award" | "Calendar",
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar este hito histórico?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingMilestone(null);
      form.reset();
    }
    setDialogOpen(open);
  };

  const getIcon = (iconName: string) => {
    const option = iconOptions.find((opt) => opt.value === iconName);
    return option ? option.icon : Flag;
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
            Historia
          </h1>
          <p className="text-muted-foreground">
            Administre los hitos históricos del Cuerpo de Banderas
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-milestone">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Hito
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMilestone ? "Editar Hito" : "Nuevo Hito"}
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
                        <Textarea {...field} rows={4} data-testid="input-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="iconName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icono</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-icon">
                            <SelectValue placeholder="Seleccione un icono" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {iconOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
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
                      : editingMilestone
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
        {milestones?.map((milestone) => {
          const Icon = getIcon(milestone.iconName);
          return (
            <Card key={milestone.id} data-testid={`card-milestone-${milestone.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="rounded-full bg-primary/10 p-3 flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary">
                          {milestone.year}
                        </span>
                      </div>
                      <CardTitle className="text-xl mt-1">{milestone.title}</CardTitle>
                      <p className="text-muted-foreground mt-2">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(milestone)}
                      data-testid={`button-edit-${milestone.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(milestone.id)}
                      data-testid={`button-delete-${milestone.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}

        {milestones?.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay hitos históricos registrados</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
