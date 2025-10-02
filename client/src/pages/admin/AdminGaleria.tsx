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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, Image as ImageIcon, FolderIcon } from "lucide-react";
import type { GalleryItem, GalleryCategory } from "@shared/schema";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
});

const itemFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  imageFile: z.instanceof(File).optional().nullable(),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;
type ItemFormData = z.infer<typeof itemFormSchema>;

export default function AdminGaleria() {
  const { toast } = useToast();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  const { data: categories, isLoading: categoriesLoading } = useQuery<GalleryCategory[]>({
    queryKey: ["/api/admin/gallery-categories"],
  });

  const { data: items, isLoading: itemsLoading } = useQuery<GalleryItem[]>({
    queryKey: ["/api/admin/gallery"],
  });

  const categoryForm = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const itemForm = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      year: "",
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: CategoryFormData) => apiRequest("POST", "/api/admin/gallery-categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery-categories"] });
      toast({
        title: "Categoría creada",
        description: "La categoría se ha creado correctamente.",
      });
      setCategoryDialogOpen(false);
      categoryForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) =>
      apiRequest("PUT", `/api/admin/gallery-categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery-categories"] });
      toast({
        title: "Categoría actualizada",
        description: "La categoría se ha actualizado correctamente.",
      });
      setCategoryDialogOpen(false);
      setEditingCategory(null);
      categoryForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/gallery-categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery-categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery"] });
      toast({
        title: "Categoría eliminada",
        description: "La categoría se ha eliminado correctamente.",
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

  const createItemMutation = useMutation({
    mutationFn: async (data: ItemFormData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.categoryId) formData.append("categoryId", data.categoryId);
      if (data.year) formData.append("year", data.year);
      if (data.imageFile) formData.append("image", data.imageFile);

      const res = await fetch("/api/admin/gallery", {
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery"] });
      toast({
        title: "Imagen agregada",
        description: "La imagen se ha agregado correctamente.",
      });
      setItemDialogOpen(false);
      itemForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ItemFormData }) => {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.categoryId) formData.append("categoryId", data.categoryId);
      if (data.year) formData.append("year", data.year);
      if (data.imageFile) formData.append("image", data.imageFile);

      const res = await fetch(`/api/admin/gallery/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery"] });
      toast({
        title: "Imagen actualizada",
        description: "La imagen se ha actualizado correctamente.",
      });
      setItemDialogOpen(false);
      setEditingItem(null);
      itemForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/gallery/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery"] });
      toast({
        title: "Imagen eliminada",
        description: "La imagen se ha eliminado correctamente.",
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

  const onCategorySubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  const onItemSubmit = (data: ItemFormData) => {
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, data });
    } else {
      createItemMutation.mutate(data);
    }
  };

  const handleEditCategory = (category: GalleryCategory) => {
    setEditingCategory(category);
    categoryForm.reset({
      name: category.name,
      slug: category.slug,
    });
    setCategoryDialogOpen(true);
  };

  const handleEditItem = (item: GalleryItem) => {
    setEditingItem(item);
    itemForm.reset({
      title: item.title,
      description: item.description || "",
      categoryId: item.categoryId || "",
      year: item.year || "",
    });
    setItemDialogOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar esta categoría? Se eliminarán todas las imágenes asociadas.")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar esta imagen?")) {
      deleteItemMutation.mutate(id);
    }
  };

  const filteredItems = items?.filter((item) => {
    if (selectedCategoryFilter === "all") return true;
    if (selectedCategoryFilter === "uncategorized") return !item.categoryId;
    return item.categoryId === selectedCategoryFilter;
  });

  if (categoriesLoading || itemsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          Galería
        </h1>
        <p className="text-muted-foreground">
          Administre las categorías e imágenes de la galería
        </p>
      </div>

      <Tabs defaultValue="items" className="w-full">
        <TabsList>
          <TabsTrigger value="items" data-testid="tab-items">Imágenes</TabsTrigger>
          <TabsTrigger value="categories" data-testid="tab-categories">Categorías</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-6">
          <div className="flex justify-between items-center gap-4">
            <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
              <SelectTrigger className="w-64" data-testid="select-category-filter">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="uncategorized">Sin categoría</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={itemDialogOpen} onOpenChange={(open) => {
              if (!open) {
                setEditingItem(null);
                itemForm.reset();
              }
              setItemDialogOpen(open);
            }}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-item">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Imagen
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Editar Imagen" : "Nueva Imagen"}
                  </DialogTitle>
                </DialogHeader>

                <Form {...itemForm}>
                  <form onSubmit={itemForm.handleSubmit(onItemSubmit)} className="space-y-4">
                    <FormField
                      control={itemForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-item-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={itemForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción (opcional)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              value={field.value || ""}
                              rows={3}
                              data-testid="input-item-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={itemForm.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría (opcional)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger data-testid="select-item-category">
                                <SelectValue placeholder="Seleccione una categoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Sin categoría</SelectItem>
                              {categories?.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={itemForm.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Año (opcional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value || ""}
                              placeholder="2024"
                              data-testid="input-item-year"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={itemForm.control}
                      name="imageFile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Imagen</FormLabel>
                          <FormControl>
                            <ImageUploader
                              onImageSelect={(file) => field.onChange(file)}
                              currentImageUrl={editingItem?.imageUrl || undefined}
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
                        onClick={() => {
                          setItemDialogOpen(false);
                          setEditingItem(null);
                          itemForm.reset();
                        }}
                        data-testid="button-cancel-item"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={createItemMutation.isPending || updateItemMutation.isPending}
                        data-testid="button-submit-item"
                      >
                        {createItemMutation.isPending || updateItemMutation.isPending
                          ? "Guardando..."
                          : editingItem
                          ? "Actualizar"
                          : "Crear"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems?.map((item) => (
              <Card key={item.id} data-testid={`card-item-${item.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-sm line-clamp-2">{item.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditItem(item)}
                        data-testid={`button-edit-item-${item.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteItem(item.id)}
                        data-testid={`button-delete-item-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square w-full bg-muted rounded-md overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      data-testid={`img-item-${item.id}`}
                    />
                  </div>
                  {item.year && (
                    <p className="text-xs text-muted-foreground mt-2">Año: {item.year}</p>
                  )}
                </CardContent>
              </Card>
            ))}

            {filteredItems?.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay imágenes en esta categoría</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={categoryDialogOpen} onOpenChange={(open) => {
              if (!open) {
                setEditingCategory(null);
                categoryForm.reset();
              }
              setCategoryDialogOpen(open);
            }}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-category">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Categoría
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                  </DialogTitle>
                </DialogHeader>

                <Form {...categoryForm}>
                  <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
                    <FormField
                      control={categoryForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-category-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={categoryForm.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="eventos-2024"
                              data-testid="input-category-slug"
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
                        onClick={() => {
                          setCategoryDialogOpen(false);
                          setEditingCategory(null);
                          categoryForm.reset();
                        }}
                        data-testid="button-cancel-category"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                        data-testid="button-submit-category"
                      >
                        {createCategoryMutation.isPending || updateCategoryMutation.isPending
                          ? "Guardando..."
                          : editingCategory
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
            {categories?.map((category) => (
              <Card key={category.id} data-testid={`card-category-${category.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <CardTitle>{category.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Slug: {category.slug}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditCategory(category)}
                        data-testid={`button-edit-category-${category.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteCategory(category.id)}
                        data-testid={`button-delete-category-${category.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}

            {categories?.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FolderIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay categorías registradas</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
