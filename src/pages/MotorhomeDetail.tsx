import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, Fuel, Ruler, Users, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import QuoteRequestForm from "@/components/QuoteRequestForm";

const MotorhomeDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: motorhome, isLoading } = useQuery({
    queryKey: ["motorhome", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("motorhomes")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!motorhome) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold">Motorhome niet gevonden</h1>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/motorhomes">Terug naar aanbod</Link>
        </Button>
      </div>
    );
  }

  const specs = [
    { icon: Calendar, label: "Bouwjaar", value: motorhome.year },
    { icon: Fuel, label: "Brandstof", value: motorhome.fuel_type },
    { icon: Ruler, label: "Lengte", value: motorhome.length_m ? `${motorhome.length_m}m` : null },
    { icon: Users, label: "Slaapplaatsen", value: motorhome.sleeps },
    { icon: Gauge, label: "Kilometerstand", value: motorhome.mileage ? `${motorhome.mileage.toLocaleString("nl-BE")} km` : null },
  ].filter((s) => s.value);

  const imageUrl = motorhome.images?.[0] || "/placeholder.svg";

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link to="/motorhomes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Terug naar aanbod
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Image & info */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-xl">
            <img
              src={imageUrl}
              alt={motorhome.title}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          {/* Extra images */}
          {motorhome.images && motorhome.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {motorhome.images.slice(1, 5).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${motorhome.title} ${i + 2}`}
                  className="aspect-square w-full rounded-lg object-cover"
                />
              ))}
            </div>
          )}

          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                {motorhome.title}
              </h1>
              {motorhome.status === "sold" && (
                <Badge variant="destructive">Verkocht</Badge>
              )}
              {motorhome.status === "reserved" && (
                <Badge className="bg-accent text-accent-foreground">Gereserveerd</Badge>
              )}
            </div>

            {motorhome.price && (
              <p className="mt-2 font-heading text-3xl font-bold text-primary">
                €{motorhome.price.toLocaleString("nl-BE")}
              </p>
            )}

            {specs.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <spec.icon className="h-4 w-4 text-primary" />
                    <span>
                      <span className="font-medium text-foreground">{spec.label}:</span> {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {motorhome.features && motorhome.features.length > 0 && (
              <div className="mt-6">
                <h3 className="font-heading text-lg font-semibold">Kenmerken</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {motorhome.features.map((f) => (
                    <Badge key={f} variant="secondary">{f}</Badge>
                  ))}
                </div>
              </div>
            )}

            {motorhome.description && (
              <div className="mt-6">
                <h3 className="font-heading text-lg font-semibold">Beschrijving</h3>
                <p className="mt-2 whitespace-pre-line font-body text-sm leading-relaxed text-muted-foreground">
                  {motorhome.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quote form */}
        <div className="lg:col-span-2">
          <Card className="sticky top-24 p-6">
            <QuoteRequestForm motorhomeId={motorhome.id} motorhomeTitle={motorhome.title} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MotorhomeDetail;
