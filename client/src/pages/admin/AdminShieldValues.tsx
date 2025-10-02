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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, Award, Shield as ShieldIcon, Star, Flag, Target, Heart } from "lucide-react";
import type { ShieldValue } from "@shared/schema";

const iconMap = {
  'Award': Award,
  'ShieldIcon': ShieldIcon,
  'Star': Star,
  'Flag': Flag,
  'Target': Target,
  'Heart': Heart
};

const formSchema = z.object({
  title: z.string().min(1, "Título es requerido"),
  description: z.string().min(1, "Descripción es requerida"),
  iconName: z.string().min(1, "Ícono es requerido"),
  displayOrder: z.number().int().min(0).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function AdminShieldValues() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<ShieldValue | null>(null);

  const { data: values, isLoading } = useQuery<ShieldValue[]>({
    queryKey: ["/api/admin/shield-values"],
  });

  const sortedValues = values?.sort((a, b) => a.displayOrder - b.displayOrder) || [];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      iconName: "Award",
      displayOrder: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("POST", "/api/admin/shield-values", {
        title: data.title,
        description: data.description,
        iconName: data.iconName,
        displayOrder: data.displayOrder || 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shield-values"] });
      toast({
        title: "Valor creado",
        description: "El valor del escudo se ha creado correctamente.",
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
      return apiRequest("PUT", `/api/admin/shield-values/${id}`, {
        title: data.title,
        description: data.description,
        iconName: data.iconName,
        displayOrder: data.displayOrder || 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shield-values"] });
      toast({
        title: "Valor actualizado",
        description: "El valor del escudo se ha actualizado correctamente.",
      });
      setDialogOpen(false);
      setEditingValue(null);
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
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/shield-values/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shield-values"] });
      toast({
        title: "Valor eliminado",
        description: "El valor del escudo se ha eliminado correctamente.",
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
    if (editingValue) {
      updateMutation.mutate({ id: editingValue.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (value: ShieldValue) => {
    setEditingValue(value);
    form.reset({
      title: value.title,
      description: value.description,
      iconName: value.iconName,
      displayOrder: value.displayOrder,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar este valor del escudo?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingValue(null);
      form.reset();
    }
    setDialogOpen(open);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Valores del Escudo</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los valores que representa el Cuerpo de Banderas
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-value">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Valor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingValue ? "Editar Valor del Escudo" : "Nuevo Valor del Escudo"}
              </DialogTitle>
              <DialogDescription>
                {editingValue 
                  ? "Modifica el valor del escudo y su descripción." 
                  : "Agrega un nuevo valor que representa el Cuerpo de Banderas."}
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
                          placeholder="Honor"
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
                          placeholder="El compromiso con la excelencia y la integridad..."
                          data-testid="input-description"
                        />
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
                      <FormLabel>Ícono</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-icon">
                            <SelectValue placeholder="Selecciona un ícono" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Award">Award (Premio)</SelectItem>
                          <SelectItem value="ShieldIcon">ShieldIcon (Escudo)</SelectItem>
                          <SelectItem value="Star">Star (Estrella)</SelectItem>
                          <SelectItem value="Flag">Flag (Bandera)</SelectItem>
                          <SelectItem value="Target">Target (Objetivo)</SelectItem>
                          <SelectItem value="Heart">Heart (Corazón)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Ícono que representa este valor
                      </FormDescription>
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
                      : editingValue
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-64 w-full" />
          ))}
        </div>
      ) : sortedValues.length === 0 ? (
        <Card className="p-12 text-center">
          <ShieldIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No hay valores registrados
          </h3>
          <p className="text-muted-foreground mb-4">
            Comienza agregando tu primer valor del escudo
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedValues.map((value) => {
            const IconComponent = iconMap[value.iconName as keyof typeof iconMap] || Award;
            return (
              <Card key={value.id} className="text-center" data-testid={`card-value-${value.id}`}>
                <CardHeader>
                  <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg" data-testid={`text-title-${value.id}`}>
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground" data-testid={`text-description-${value.id}`}>
                    {value.description}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(value)}
                      data-testid={`button-edit-${value.id}`}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(value.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${value.id}`}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
