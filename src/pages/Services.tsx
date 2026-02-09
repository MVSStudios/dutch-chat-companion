import { Link } from "react-router-dom";
import { ShieldCheck, Wrench, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: TrendingUp,
    title: "Aankoop & Verkoop",
    description: "Wij begeleiden u bij elke stap van het aankoop- of verkoopproces van uw motorhome.",
    points: [
      "Eerlijke en transparante waardering",
      "Uitgebreide selectie motorhomes",
      "Persoonlijke begeleiding van A tot Z",
      "Administratieve afhandeling inbegrepen",
    ],
  },
  {
    icon: Wrench,
    title: "Montage & Installatie",
    description: "Professionele montage van allerlei accessoires en systemen voor uw motorhome.",
    points: [
      "Zonnepanelen & energiesystemen",
      "Satelliet- & TV-installaties",
      "Fietsendragers & accessoires",
      "Alarmsystemen & beveiliging",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Advies op maat",
    description: "Onze experts staan klaar om u persoonlijk te adviseren, ongeacht uw ervaring.",
    points: [
      "Advies voor beginners & ervaren reizigers",
      "Budget- en routeplanning",
      "Technisch advies & onderhoudstips",
      "Inruilmogelijkheden bespreken",
    ],
  },
];

const Services = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
        Onze diensten
      </h1>
      <p className="mt-2 max-w-2xl font-body text-muted-foreground">
        Bij J&C Motorhomes kunt u terecht voor alles rondom motorhomes.
        Van aankoop tot montage, wij zijn uw all-in-one partner.
      </p>

      <div className="mt-12 space-y-12">
        {services.map((service) => (
          <div
            key={service.title}
            className="rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <service.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-semibold text-card-foreground">
                  {service.title}
                </h2>
                <p className="mt-2 font-body text-muted-foreground">
                  {service.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 font-body text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-xl bg-primary p-10 text-center text-primary-foreground">
        <h2 className="font-heading text-2xl font-bold md:text-3xl">
          Interesse? Neem contact op!
        </h2>
        <p className="mx-auto mt-3 max-w-lg font-body opacity-85">
          Wij helpen u graag verder. Neem vrijblijvend contact met ons op voor meer informatie.
        </p>
        <Button asChild size="lg" variant="secondary" className="mt-6">
          <Link to="/contact">
            Contacteer ons
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Services;
