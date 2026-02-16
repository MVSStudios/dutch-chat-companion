import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import snelImg from "@/assets/verkoop-snel.jpg";
import ontzorgingImg from "@/assets/verkoop-ontzorging.jpg";
import eerlijkImg from "@/assets/verkoop-eerlijk.jpg";

const usps = [
{
  image: snelImg,
  title: "Snel en zorgeloos",
  description: "Wij garanderen een vlotte afhandeling en snelle uitbetaling, vaak binnen enkele weken. Spoedverkoop? Een directe overname is ook mogelijk."
},
{
  image: ontzorgingImg,
  title: "Volledige ontzorging",
  description: "Van waardebepaling tot verkoop en papierwerk, wij nemen alles uit handen. Geen tijdverlies, geen onbekende kopers aan je deur."
},
{
  image: eerlijkImg,
  title: "Eerlijke marktwaarde",
  description: "Dankzij onze marktkennis en expertise ontvang je altijd een correcte en competitieve prijs voor je mobilhome, zonder verborgen kosten."
}];


const Purchase = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", brand: "", model: "",
    motor: "", transmission: "", mileage: "",
    first_registration: "", horsepower: "",
    fuel_type: "", length_m: "", sleeps: "",
    options: "", damage: "", immediately_available: "",
    description: "", message: ""
  });

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("purchase_requests").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      brand: form.brand,
      model: form.model,
      year: new Date().getFullYear(),
      motor: form.motor || null,
      transmission: form.transmission || null,
      mileage: form.mileage ? Number(form.mileage) : null,
      first_registration: form.first_registration || null,
      horsepower: form.horsepower ? Number(form.horsepower) : null,
      fuel_type: form.fuel_type || null,
      length_m: form.length_m ? Number(form.length_m) : null,
      sleeps: form.sleeps ? Number(form.sleeps) : null,
      options: form.options || null,
      damage: form.damage || null,
      immediately_available: form.immediately_available || null,
      description: form.description || null,
      message: form.message || null
    });

    if (!error) {
      supabase.functions.invoke("send-notification-email", {
        body: { type: "purchase", data: form }
      });
    }

    setLoading(false);
    if (error) {
      toast.error("Er ging iets mis. Probeer het opnieuw.");
      return;
    }
    toast.success("Uw aanvraag is verstuurd! Wij nemen zo snel mogelijk contact op.");
    setForm({ name: "", email: "", phone: "", brand: "", model: "", motor: "", transmission: "", mileage: "", first_registration: "", horsepower: "", fuel_type: "", length_m: "", sleeps: "", options: "", damage: "", immediately_available: "", description: "", message: "" });
  };

  return (
    <div>
      {/* Hero / landing section */}
      <section className="py-16 md:py-24 bg-[#1e2421]">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Waarom jouw mobilhome aan J&C Motorhomes verkopen?
          </h1>
          <p className="mt-4 max-w-3xl font-body text-muted-foreground">
            Verkoop je mobilhome zonder gedoe. Bij J&C Motorhomes geniet je van expertise, snelheid en een transparant proces. Ontdek de voordelen van samenwerken met een partner die jouw tijd en mobilhome waardeert.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {usps.map((usp) =>
            <div key={usp.title} className="overflow-hidden rounded-xl">
                <img
                src={usp.image}
                alt={usp.title}
                className="aspect-[4/3] w-full object-cover" />

                <div className="pt-5">
                  <h3 className="font-heading text-xl font-semibold text-foreground">{usp.title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{usp.description}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" onClick={scrollToForm} className="gap-2 text-base">
              <MessageCircle className="h-5 w-5" />
              Start jouw verkoop
            </Button>
          </div>
        </div>
      </section>

      {/* Form section */}
      <div ref={formRef} className="container mx-auto px-4 py-16">
        <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Vul uw gegevens in</h2>
        <p className="mt-2 font-body text-muted-foreground">Wij doen u een vrijblijvend bod.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <Card className="p-6 lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-heading text-xl font-semibold text-foreground">Uw gegevens</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Naam *</Label>
                  <Input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>E-mail *</Label>
                  <Input type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Telefoon *</Label>
                <Input type="tel" required value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>

              <h3 className="font-heading text-xl font-semibold text-foreground pt-4">Camper gegevens</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Merk *</Label>
                  <Input required value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Model *</Label>
                  <Input required value={form.model} onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Motor</Label>
                  <Input placeholder="Bv. 2.3 MultiJet" value={form.motor} onChange={(e) => setForm((p) => ({ ...p, motor: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Transmissie *</Label>
                  <Select required value={form.transmission} onValueChange={(v) => setForm((p) => ({ ...p, transmission: v }))}>
                    <SelectTrigger><SelectValue placeholder="Kies..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automaat">Automaat</SelectItem>
                      <SelectItem value="manueel">Manueel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Kilometerstand *</Label>
                  <Input type="number" required value={form.mileage} onChange={(e) => setForm((p) => ({ ...p, mileage: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>1ste inschrijving</Label>
                  <Input type="date" value={form.first_registration} onChange={(e) => setForm((p) => ({ ...p, first_registration: e.target.value }))} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Hoeveel PK *</Label>
                  <Input type="number" required value={form.horsepower} onChange={(e) => setForm((p) => ({ ...p, horsepower: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Brandstof *</Label>
                  <Select required value={form.fuel_type} onValueChange={(v) => setForm((p) => ({ ...p, fuel_type: v }))}>
                    <SelectTrigger><SelectValue placeholder="Kies..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diesel">Diesel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Slaapplaatsen</Label>
                  <Input type="number" value={form.sleeps} onChange={(e) => setForm((p) => ({ ...p, sleeps: e.target.value }))} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Lengte (m)</Label>
                  <Input type="number" step="0.1" value={form.length_m} onChange={(e) => setForm((p) => ({ ...p, length_m: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Onmiddellijk leverbaar *</Label>
                  <Select required value={form.immediately_available} onValueChange={(v) => setForm((p) => ({ ...p, immediately_available: v }))}>
                    <SelectTrigger><SelectValue placeholder="Kies..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ja">Ja</SelectItem>
                      <SelectItem value="nee">Nee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Eventuele opties</Label>
                <Textarea rows={2} placeholder="Bv. cruise control, camera, zonnepanelen..." value={form.options} onChange={(e) => setForm((p) => ({ ...p, options: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Schade</Label>
                <Textarea rows={2} placeholder="Beschrijf eventuele schade..." value={form.damage} onChange={(e) => setForm((p) => ({ ...p, damage: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Beschrijving van de camper</Label>
                <Textarea rows={3} placeholder="Staat, bijzonderheden, accessoires..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Extra bericht</Label>
                <Textarea rows={2} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Versturen..." : "Vrijblijvend bod aanvragen"}
              </Button>
            </form>
          </Card>

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground">Waarom bij ons verkopen?</h3>
              <ul className="mt-4 space-y-3">
                {[
                "Eerlijk en transparant bod",
                "Snelle afhandeling",
                "Gratis en vrijblijvend",
                "Administratie door ons geregeld",
                "Campers vanaf bouwjaar 2000"].
                map((p) =>
                <li key={p} className="flex items-center gap-2 font-body text-sm text-foreground">
                    <span className="h-4 w-4 shrink-0 text-primary">✓</span> {p}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default Purchase;