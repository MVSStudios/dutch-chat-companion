import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Wrench, TrendingUp, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MotorhomeCard from "@/components/MotorhomeCard";
import heroImage from "@/assets/hero-motorhome.jpg";
import aboutImage from "@/assets/about-team.png";

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
  const { data: motorhomes } = useQuery({
    queryKey: ["featured-motorhomes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("motorhomes")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Motorhome in landschap" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-4xl font-bold text-primary-foreground md:text-6xl lg:text-7xl">
            J&C Motorhomes
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-primary-foreground/85 md:text-xl">
            Uw specialist in aankoop, verkoop, montage en advies van motorhomes. Ontdek ons 2dehands aanbod en rij uw droom tegemoet.
          </p>
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
          {services.map(s => (
            <div key={s.title} className="rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-5 font-heading text-xl font-semibold text-card-foreground">{s.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      {motorhomes && motorhomes.length > 0 && (
        <section className="bg-muted py-20">
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
        </section>
      )}

      {/* Wie zijn we */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Wie zijn we?</h2>
              <p className="mt-4 font-body leading-relaxed text-muted-foreground">
                Wij zijn Johan en Clenn, samen bundelen wij ruim twintig jaar ervaring in de motorhomebranche. Johan in verkoop, begeleiding en advies. Clenn als technieker, installateur en eveneens technisch advies. Onze passie en dynamiek willen wij nu bundelen op een onafhankelijke manier en op zelfstandige basis.
              </p>
              <p className="mt-4 font-body leading-relaxed text-muted-foreground">
                Of je nu start met je eerste motorhome-ervaring of een doorwinterde reiziger bent: bij ons ben je geen nummer, maar een reiziger met een verhaal. Wij denken mee, zoeken oplossingen op maat en gaan voor een langdurige vertrouwensrelatie.
              </p>
              <h3 className="mt-8 font-heading text-2xl font-bold text-foreground">Wat ons drijft?</h3>
              <p className="mt-4 font-body leading-relaxed text-muted-foreground">
                De nood en steeds groter wordende vraag naar betaalbare 2dehands motorhomes.
              </p>
              <p className="mt-4 font-body leading-relaxed text-muted-foreground">
                Het kunnen aanbieden van een luisterend oor en hierbij streven naar een grote klantentevredenheid door een combinatie van een toegankelijke en persoonlijke aanpak binnen een steeds groter wordende dealerwereld.
              </p>
              <Button asChild size="lg" className="mt-8">
                <Link to="/contact">
                  Maak een afspraak
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="overflow-hidden rounded-xl">
              <img src={aboutImage} alt="Team J&C Motorhomes" className="h-auto w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Adres & Map */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-heading text-3xl font-bold text-foreground md:text-4xl">Waar vindt u ons?</h2>
          <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-6 w-6 shrink-0 text-primary" />
                <div>
                  <h3 className="font-heading text-xl font-semibold text-foreground">J&C Motorhomes</h3>
                  <p className="mt-2 font-body text-muted-foreground">Industrieweg 4</p>
                  <p className="font-body text-muted-foreground">3540 Herk-de-Stad</p>
                  <p className="font-body text-muted-foreground">België</p>
                  <p className="mt-4 font-body text-muted-foreground">
                    <strong className="text-foreground">Tel:</strong>{" "}
                    <a href="tel:+32468331480" className="text-primary hover:underline">+32 468 33 14 80</a>
                  </p>
                  <p className="font-body text-muted-foreground">
                    <strong className="text-foreground">E-mail:</strong>{" "}
                    <a href="mailto:info@jc-motorhomes.be" className="text-primary hover:underline">info@jc-motorhomes.be</a>
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <iframe
                title="Locatie J&C Motorhomes"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2520.5!2d5.17!3d50.93!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zIndustraWV3ZWcgNCwgMzU0MCBIZXJrLWRlLVN0YWQ!5e0!3m2!1snl!2sbe!4v1234567890"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;