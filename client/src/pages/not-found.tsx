import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { t } from "@/lib/i18n";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center gap-4 mb-4">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <h1 className="text-2xl font-bold text-foreground">{t("notFound.title")}</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-6">{t("notFound.body")}</p>
          <Button onClick={() => navigate("/")} className="hover-elevate" data-testid="button-not-found-home">
            {t("notFound.home")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
