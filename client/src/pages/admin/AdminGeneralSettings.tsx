import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
import { S3ImageUploader } from "@/components/admin/S3ImageUploader";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SiteConfig } from "@shared/schema";

const formSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteSubtitle: z.string().min(1, "Site subtitle is required"),
  heroDescription: z.string().optional().nullable(),
  contactEmail: z.string().email("Invalid email").optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  trainingSchedule: z.string().optional().nullable(),
  trainingLocation: z.string().optional().nullable(),
  ceremoniesSchedule: z.string().optional().nullable(),
  ceremoniesNotes: z.string().optional().nullable(),
  meetingsSchedule: z.string().optional().nullable(),
  meetingsLocation: z.string().optional().nullable(),
  admissionRequirements: z.array(z.string()).optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  footerDescription: z.string().optional().nullable(),
  missionStatement: z.string().optional().nullable(),
  leadershipTitle: z.string().optional().nullable(),
  leadershipDescription: z.string().optional().nullable(),
  leadershipImageUrl: z.string().optional().nullable(),
  leadershipImageS3Key: z.string().optional().nullable(),
  foundingYear: z.number().int().min(1900).max(2100),
});

type FormData = z.infer<typeof formSchema>;

export default function AdminGeneralSettings() {
  const { toast } = useToast();
  const [removeLogo, setRemoveLogo] = useState(false);
  const [removeFavicon, setRemoveFavicon] = useState(false);
  const [removeLeadershipImage, setRemoveLeadershipImage] = useState(false);
  
  const { data: config, isLoading } = useQuery<SiteConfig>({
    queryKey: ["/api/admin/site-config"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: "",
      siteSubtitle: "",
      heroDescription: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      trainingSchedule: "",
      trainingLocation: "",
      ceremoniesSchedule: "",
      ceremoniesNotes: "",
      meetingsSchedule: "",
      meetingsLocation: "",
      admissionRequirements: [],
      footerDescription: "",
      missionStatement: "",
      leadershipTitle: "",
      leadershipDescription: "",
      leadershipImageUrl: "",
      leadershipImageS3Key: "",
      foundingYear: 1951,
    },
  });

  useEffect(() => {
    if (config) {
      form.reset({
        siteName: config.siteName || "",
        siteSubtitle: config.siteSubtitle || "",
        heroDescription: config.heroDescription || "",
        contactEmail: config.contactEmail || "",
        contactPhone: config.contactPhone || "",
        address: config.address || "",
        trainingSchedule: config.trainingSchedule || "",
        trainingLocation: config.trainingLocation || "",
        ceremoniesSchedule: config.ceremoniesSchedule || "",
        ceremoniesNotes: config.ceremoniesNotes || "",
        meetingsSchedule: config.meetingsSchedule || "",
        meetingsLocation: config.meetingsLocation || "",
        admissionRequirements: config.admissionRequirements || [],
        footerDescription: config.footerDescription || "",
        missionStatement: config.missionStatement || "",
        leadershipTitle: config.leadershipTitle || "",
        leadershipDescription: config.leadershipDescription || "",
        leadershipImageUrl: config.leadershipImageUrl || "",
        leadershipImageS3Key: config.leadershipImageS3Key || "",
        foundingYear: config.foundingYear || 1951,
      });
      // Reset removal flags when config loads
      setRemoveLogo(false);
      setRemoveFavicon(false);
      setRemoveLeadershipImage(false);
    }
  }, [config, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("PUT", "/api/admin/site-config/with-url", {
        siteName: data.siteName,
        siteSubtitle: data.siteSubtitle,
        heroDescription: data.heroDescription || null,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        address: data.address || null,
        trainingSchedule: data.trainingSchedule || null,
        trainingLocation: data.trainingLocation || null,
        ceremoniesSchedule: data.ceremoniesSchedule || null,
        ceremoniesNotes: data.ceremoniesNotes || null,
        meetingsSchedule: data.meetingsSchedule || null,
        meetingsLocation: data.meetingsLocation || null,
        admissionRequirements: data.admissionRequirements || [],
        logoUrl: data.logoUrl || null,
        faviconUrl: data.faviconUrl || null,
        footerDescription: data.footerDescription || null,
        missionStatement: data.missionStatement || null,
        leadershipTitle: data.leadershipTitle || null,
        leadershipDescription: data.leadershipDescription || null,
        leadershipImageUrl: data.leadershipImageUrl || null,
        leadershipImageS3Key: data.leadershipImageS3Key || null,
        foundingYear: data.foundingYear || 1951,
        removeLogo,
        removeFavicon,
        removeLeadershipImage,
      });
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

              <FormField
                control={form.control}
                name="heroDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción Principal</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        rows={3}
                        data-testid="input-hero-description"
                        placeholder="Honor, disciplina y patriotismo..."
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
              <CardTitle>Proceso de Ingreso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="admissionRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requisitos de Admisión</FormLabel>
                    <FormControl>
                      <Textarea
                        value={field.value?.join('\n') || ""}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n').filter(line => line.trim());
                          field.onChange(lines);
                        }}
                        rows={6}
                        data-testid="input-admission-requirements"
                        placeholder="Ingresa un requisito por línea&#10;Ejemplo:&#10;Ser estudiante activo del Liceo&#10;Mantener promedio académico mínimo"
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Ingresa cada requisito en una línea separada. Las líneas vacías serán ignoradas.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horarios y Actividades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Entrenamientos Regulares</h3>
                <FormField
                  control={form.control}
                  name="trainingSchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horario de Entrenamiento</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          data-testid="input-training-schedule"
                          placeholder="Martes y Jueves, 2:00 PM - 4:00 PM"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trainingLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lugar de Entrenamiento</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          data-testid="input-training-location"
                          placeholder="Patio principal del Liceo"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-sm">Ceremonias Especiales</h3>
                <FormField
                  control={form.control}
                  name="ceremoniesSchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horario de Ceremonias</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          data-testid="input-ceremonies-schedule"
                          placeholder="Fechas patrias y eventos institucionales"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ceremoniesNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas sobre Ceremonias</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          data-testid="input-ceremonies-notes"
                          placeholder="Se coordinan con anticipación"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-sm">Reuniones de Coordinación</h3>
                <FormField
                  control={form.control}
                  name="meetingsSchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horario de Reuniones</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          data-testid="input-meetings-schedule"
                          placeholder="Viernes, 3:00 PM - 4:00 PM"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meetingsLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lugar de Reuniones</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          data-testid="input-meetings-location"
                          placeholder="Aula de coordinación"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información Institucional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="foundingYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año de Fundación</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        value={field.value || 1951}
                        data-testid="input-founding-year"
                        placeholder="1951"
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Este año se usa para calcular automáticamente los años de tradición en toda la página.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="footerDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción del Footer</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        rows={3}
                        data-testid="input-footer-description"
                        placeholder="Formando jóvenes costarricenses con valores patrióticos..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="missionStatement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Declaración de Misión</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        rows={3}
                        data-testid="input-mission-statement"
                        placeholder="Formar estudiantes con valores patrióticos..."
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Se muestra en la sección de Historia como "Nuestra Misión".
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sección de Liderazgo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="leadershipTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título de Liderazgo</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        data-testid="input-leadership-title"
                        placeholder="Tradición de Liderazgo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leadershipDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción de Liderazgo</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        rows={3}
                        data-testid="input-leadership-description"
                        placeholder="Desde 1951, el Cuerpo de Banderas ha sido dirigido..."
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Se muestra en la sección destacada de Jefaturas y en la página principal.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leadershipImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagen de Liderazgo</FormLabel>
                    <FormControl>
                      <S3ImageUploader
                        onUploadComplete={(url, fileKey) => {
                          field.onChange(url);
                          if (fileKey) {
                            form.setValue('leadershipImageS3Key', fileKey);
                          }
                          setRemoveLeadershipImage(false);
                        }}
                        currentImageUrl={config?.leadershipImageUrl || undefined}
                        onRemove={() => {
                          field.onChange(null);
                          form.setValue('leadershipImageS3Key', "");
                          setRemoveLeadershipImage(true);
                        }}
                        folder="leadership"
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
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <S3ImageUploader
                        onUploadComplete={(url) => {
                          field.onChange(url);
                          setRemoveLogo(false);
                        }}
                        currentImageUrl={config?.logoUrl || undefined}
                        onRemove={() => {
                          field.onChange(null);
                          setRemoveLogo(true);
                        }}
                        folder="site-config"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="faviconUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favicon</FormLabel>
                    <FormControl>
                      <S3ImageUploader
                        onUploadComplete={(url) => {
                          field.onChange(url);
                          setRemoveFavicon(false);
                        }}
                        currentImageUrl={config?.faviconUrl || undefined}
                        onRemove={() => {
                          field.onChange(null);
                          setRemoveFavicon(true);
                        }}
                        folder="site-config"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

        </form>
      </Form>

      {createPortal(
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={updateMutation.isPending}
          data-testid="button-save-settings"
          className="shadow-lg"
          size="lg"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 50,
          }}
        >
          {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
        </Button>,
        document.body
      )}
    </div>
  );
}
