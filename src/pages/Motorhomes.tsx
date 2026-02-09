import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MotorhomeCard from "@/components/MotorhomeCard";
import { Loader2 } from "lucide-react";

const Motorhomes = () => {
  const { data: motorhomes, isLoading } = useQuery({
    queryKey: ["motorhomes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("motorhomes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
        Ons aanbod
      </h1>
      <p className="mt-2 font-body text-muted-foreground">
        Ontdek onze selectie motorhomes. Interesse? Vraag vrijblijvend een offerte aan.
      </p>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : motorhomes && motorhomes.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {motorhomes.map((m) => (
            <MotorhomeCard key={m.id} {...m} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="font-body text-lg text-muted-foreground">
            Er zijn momenteel geen motorhomes beschikbaar. Neem contact met ons op voor meer informatie.
          </p>
        </div>
      )}
    </div>
  );
};

export default Motorhomes;
