import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Wrench, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MotorhomeCard from "@/components/MotorhomeCard";
import heroImage from "@/assets/hero-motorhome.jpg";
const services = [{
  icon: TrendingUp,
  title: "Aankoop & Verkoop",
  description: "Wij helpen u bij het vinden of verkopen van uw droom motorhome. Eerlijk advies en transparante prijzen."
}, {
  icon: Wrench,
  title: "Montage & Installatie",
  description: "Professionele montage van accessoires en uitrustingen voor uw motorhome."
}, {
  icon: ShieldCheck,
  title: "Advies op maat",
  description: "Persoonlijk advies afgestemd op uw wensen, budget en reisplannen."
}];
const Index = () => {
  const {
    data: motorhomes
  } = useQuery({
    queryKey: ["featured-motorhomes"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("motorhomes").select("*").eq("status", "available").order("created_at", {
        ascending: false
      }).limit(3);
      if (error) throw error;
      return data;
    }
  });
  return <div>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Motorhome in landschap" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 rounded-none shadow-none bg-[sidebar-accent-foreground] bg-[#ab8530]/[0.36]" style={{
        background: "var(--gradient-hero)"
      }} />
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-4xl font-bold text-primary-foreground md:text-6xl lg:text-7xl">
            J&C Motorhomes
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-primary-foreground/85 md:text-xl">Uw specialist in aankoop, verkoop, montage en advies van motorhomes. Ontdek ons 2 dehands aanbod en rij uw droom tegemoet.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="font-body text-base">
              <Link to="/motorhomes">
                Bekijk aanbod
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent font-body text-base text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/contact">Contacteer ons</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-center font-heading text-3xl font-bold text-foreground md:text-4xl">
          Onze diensten
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center font-body text-muted-foreground">
          Van aankoop tot montage — wij staan voor u klaar.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {services.map(s => <div key={s.title} className="rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-5 font-heading text-xl font-semibold text-card-foreground">{s.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </div>)}
        </div>
      </section>

      {/* Featured */}
      {motorhomes && motorhomes.length > 0 && <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-center font-heading text-3xl font-bold text-foreground md:text-4xl">Ons aanbod</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {motorhomes.map(m => <MotorhomeCard key={m.id} {...m} />)}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/motorhomes">
                  Bekijk volledig aanbod
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>}
    </div>;
};
export default Index;