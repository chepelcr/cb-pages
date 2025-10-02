import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SiteConfig } from "@shared/schema";

const formSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteSubtitle: z.string().min(1, "Site subtitle is required"),
  contactEmail: z.string().email("Invalid email").optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  logoFile: z.instanceof(File).optional().nullable(),
  faviconFile: z.instanceof(File).optional().nullable(),
});

type FormData = z.infer<typeof formSchema>;

export default function AdminGeneralSettings() {
  const { toast } = useToast();
  
  const { data: config, isLoading } = useQuery<SiteConfig>({
    queryKey: ["/api/admin/site-config"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: config?.siteName || "",
      siteSubtitle: config?.siteSubtitle || "",
      contactEmail: config?.contactEmail || "",
      contactPhone: config?.contactPhone || "",
      address: config?.address || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      formData.append("siteName", data.siteName);
      formData.append("siteSubtitle", data.siteSubtitle);
      if (data.contactEmail) formData.append("contactEmail", data.contactEmail);
      if (data.contactPhone) formData.append("contactPhone", data.contactPhone);
      if (data.address) formData.append("address", data.address);
      if (data.logoFile) formData.append("logo", data.logoFile);
      if (data.faviconFile) formData.append("favicon", data.faviconFile);

      const res = await fetch("/api/admin/site-config", {
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-config"] });
      toast({
        title: "Configuración guardada",
        description: "Los cambios se han guardado correctamente.",
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
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          Configuración General
        </h1>
        <p className="text-muted-foreground">
          Configure la información general del sitio
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Sitio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Sitio</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        data-testid="input-site-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siteSubtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtítulo</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        data-testid="input-site-subtitle"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email de Contacto</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        data-testid="input-contact-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono de Contacto</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        data-testid="input-contact-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        rows={3}
                        data-testid="input-address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imágenes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="logoFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <ImageUploader
                        onImageSelect={(file) => field.onChange(file)}
                        currentImageUrl={config?.logoUrl || undefined}
                        onRemove={() => field.onChange(null)}
                        maxSizeMB={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="faviconFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favicon</FormLabel>
                    <FormControl>
                      <ImageUploader
                        onImageSelect={(file) => field.onChange(file)}
                        currentImageUrl={config?.faviconUrl || undefined}
                        onRemove={() => field.onChange(null)}
                        maxSizeMB={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={updateMutation.isPending}
            data-testid="button-save-settings"
          >
            {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
