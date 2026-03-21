import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Wrench, TrendingUp, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MotorhomeCard from "@/components/MotorhomeCard";
import heroImage from "@/assets/hero-motorhome.jpg";
import aboutImage from "@/assets/about-team.png";
import waaromImage from "@/assets/waarom-jc.png";
import LocationSection from "@/components/LocationSection";
import SeoHead from "@/components/SeoHead";

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
      const { data, error } = await supabase.
      from("motorhomes").
      select("*").
      eq("status", "available").
      order("created_at", { ascending: false }).
      limit(3);
      if (error) throw error;
      return data;
    }
  });

  return (
    <div>
      <SeoHead slug="home" fallbackTitle="J&C Motorhomes - Aankoop, Verkoop & Montage" fallbackDescription="Uw specialist in aankoop, verkoop, montage en advies van tweedehands motorhomes in België." />
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Motorhome in landschap" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/[0.39]" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-primary-foreground md:text-6xl font-serif lg:text-6xl">J&C Motorhomes

          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-primary-foreground/85 md:text-xl">
            Uw droom? Uw wens? Uw reis?
          </p>
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-primary-foreground/85 md:text-xl">
           Bij J&amp;C uw tweedehands motorhome aan een betaalbare prijs.
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
      <section className="container mx-auto px-4 py-20 bg-[#212121]">
        <h2 className="text-center font-heading text-3xl font-bold text-foreground md:text-4xl">
          Ons aanbod
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center font-body text-muted-foreground">
          Van aankoop tot montage — wij staan voor u klaar.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {services.map((s) =>
          <div key={s.title} className="rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-5 text-xl text-card-foreground font-serif font-semibold">{s.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured */}
      {motorhomes && motorhomes.length > 0 &&
      <section className="py-20 bg-[#212121]">
          <div className="container mx-auto px-4">
            <h2 className="text-center font-heading text-3xl font-bold text-foreground md:text-4xl">Ons aanbod</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {motorhomes.map((m) => <MotorhomeCard key={m.id} {...m} />)}
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
      }

      {/* Wie zijn we */}
      <section className="py-20 bg-[#212121]">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Wie zijn we?</h2>
              <p className="mt-4 font-body leading-relaxed text-muted-foreground">Wij zijn Johan en Clenn, samen bundelen wij ruim twintig jaar ervaring in de motorhomebranche. Johan beschikt over een ruime achtergrond in verkoop en klantenbegeleiding, met sterke communicatieve vaardigheden en marktkennis.
Clenn is een ervaren technieker met diepgaande kennis van motorhomes, onderhoud en technische installaties.
Samen combineren we commerciële kracht met technische expertise - een unieke troef in deze markt.</p>
              <p className="mt-4 font-body leading-relaxed text-muted-foreground">
                Of je nu start met je eerste motorhome-ervaring of een doorwinterde reiziger bent: bij ons ben je geen nummer, maar een reiziger met een verhaal. Wij denken mee, zoeken oplossingen op maat en gaan voor een langdurige vertrouwensrelatie.
              </p>
              <h3 className="mt-8 font-heading text-2xl font-bold text-foreground">Wat ons drijft?</h3>
              <p className="mt-4 font-body leading-relaxed text-muted-foreground">
                De motorhome - markt blijft groeien, zowel bij jonge gezinnen als bij actieve senioren die opzoek zijn naar vrijheid en flexibiliteit.
              </p>
              <p className="mt-4 font-body leading-relaxed text-muted-foreground">
                Tegelijk stijgt de vraag naar betaalbare en betrouwbare voertuigen, met duidelijke technische ondersteuning en eerlijke service. Wij zien hier een duidelijke kans om een laagdrempelige, klantgerichte kleinhandel uit te bouwen, waar kopers kunnen rekenen op eerlijk advies, transparante prijzen en professionele begeleiding
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

      {/* Waarom J&C? */}
      <section className="py-20 bg-[#212121]">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-xl">
              <img src={waaromImage} alt="Waarom J&C Motorhomes" className="h-auto w-full object-cover" />
            </div>
            <div>
              <h2 className="text-3xl text-foreground md:text-4xl font-serif font-semibold">Waarom J&C?</h2>
              <p className="mt-4 font-body leading-relaxed text-muted-foreground">
                Wij stellen vast dat de motorhome wereld in België een overaanbod aan grote dealers heeft. De snel groeiende markt heeft ons aan den lijve doen vaststellen dat de nood aan persoonlijke opvolging, service en aanspreekpunt meer dan ooit van tel zijn. Met deze focus streven we ernaar om elke dag het beste van onszelf te geven en met onze passie jullie dromen helpen waar te maken.
              </p>
              <p className="mt-4 font-body leading-relaxed text-muted-foreground">
                Onze kleinschaligheid en geografische ligging regio Kortrijk, zijn onze troeven die zich vertalen in jullie budgettair haalbare dromen vol leuke reisverhalen. Uw droom? Uw reis? Bij J&C motorhomes aan een betaalbare prijs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <LocationSection />
    </div>);

};

export default Index;