import { MapPin, Clock } from "lucide-react";

const LocationSection = () => (
  <section className="py-20 bg-[#1e2421]">
    <div className="container mx-auto px-4">
      <h2 className="text-center font-heading text-3xl font-bold text-foreground md:text-4xl">Waar vindt u ons?</h2>
      <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="flex items-start gap-4">
            <MapPin className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h3 className="text-xl font-semibold text-foreground font-serif">J&C Motorhomes</h3>
              <p className="mt-2 font-body text-muted-foreground">Bissegemsestraat 43/003</p>
              <p className="font-body text-muted-foreground">8501 Bissegem</p>
              <p className="font-body text-muted-foreground">België</p>
              <p className="mt-4 font-body text-muted-foreground">
                <strong className="text-foreground">Verkoop:</strong>{" "}
                <a href="tel:+32468331480" className="text-primary hover:underline">+32 468 33 14 80</a>
              </p>
              <p className="font-body text-muted-foreground">
                <strong className="text-foreground">Montage:</strong>{" "}
                <a href="tel:+32498160183" className="text-primary hover:underline">+32 498 16 01 83</a>
              </p>
              <p className="font-body text-muted-foreground">
                <strong className="text-foreground">E-mail:</strong>{" "}
                <a href="mailto:info@jc-motorhomes.be" className="text-primary hover:underline">info@jc-motorhomes.be</a>
              </p>
              <div className="mt-6 border-t border-border pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h4 className="text-lg font-semibold text-foreground font-serif">Openingsuren</h4>
                </div>
                <div className="space-y-1 font-body text-sm text-muted-foreground">
                  <div className="flex justify-between gap-8"><span>Maandag</span><span>8:30 – 12:00 / 13:00 – 18:00</span></div>
                  <div className="flex justify-between gap-8"><span>Dinsdag</span><span>8:30 – 12:00 / 13:00 – 18:00</span></div>
                  <div className="flex justify-between gap-8"><span>Woensdag</span><span>8:30 – 12:00 / 13:00 – 17:00</span></div>
                  <div className="flex justify-between gap-8"><span>Donderdag</span><span>8:30 – 12:00 / 13:00 – 18:00</span></div>
                  <div className="flex justify-between gap-8"><span>Vrijdag</span><span>8:30 – 12:00 / 13:00 – 18:00</span></div>
                  <div className="flex justify-between gap-8"><span>Zaterdag</span><span>8:30 – 12:00 / 9:00 – 15:00</span></div>
                  <div className="flex justify-between gap-8"><span>Zondag</span><span className="italic">Enkel telefonisch bereikbaar</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <iframe
            title="Locatie J&C Motorhomes"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2516.5!2d3.48!3d50.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3b8d8c3a1c3a1%3A0x0!2sBissegemsestraat%2043%2F003%2C%208501%20Bissegem!5e0!3m2!1snl!2sbe!4v1234567890"
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
);

export default LocationSection;
