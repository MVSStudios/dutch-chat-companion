import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TrendingUp, CheckCircle } from "lucide-react";

const currentYear = new Date().getFullYear();

const Purchase = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", brand: "", model: "",
    year: "", mileage: "", fuel_type: "", length_m: "",
    sleeps: "", description: "", message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const yearNum = Number(form.year);
    if (yearNum < 2000 || yearNum > currentYear) {
      toast.error(`Bouwjaar moet tussen 2000 en ${currentYear} liggen.`);
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("purchase_requests").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      brand: form.brand,
      model: form.model,
      year: yearNum,
      mileage: form.mileage ? Number(form.mileage) : null,
      fuel_type: form.fuel_type || null,
      length_m: form.length_m ? Number(form.length_m) : null,
      sleeps: form.sleeps ? Number(form.sleeps) : null,
      description: form.description || null,
      message: form.message || null,
    });

    if (!error) {
      // Send email notification (fire-and-forget)
      supabase.functions.invoke("send-notification-email", {
        body: { type: "purchase", data: { ...form, year: form.year, mileage: form.mileage } },
      });
    }

    setLoading(false);
    if (error) {
      toast.error("Er ging iets mis. Probeer het opnieuw.");
      return;
    }
    toast.success("Uw aanvraag is verstuurd! Wij nemen zo snel mogelijk contact op.");
    setForm({ name: "", email: "", phone: "", brand: "", model: "", year: "", mileage: "", fuel_type: "", length_m: "", sleeps: "", description: "", message: "" });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <TrendingUp className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Uw camper verkopen?
          </h1>
          <p className="mt-2 font-body text-muted-foreground">
            Wilt u uw motorhome verkopen? Vul onderstaand formulier in en wij doen u een vrijblijvend bod.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="font-heading text-xl font-semibold text-foreground">Uw gegevens</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Naam *</Label>
                <Input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>E-mail *</Label>
                <Input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Telefoon</Label>
              <Input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>

            <h2 className="font-heading text-xl font-semibold text-foreground pt-4">Camper gegevens</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Merk *</Label>
                <Input required value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Model *</Label>
                <Input required value={form.model} onChange={e => setForm(p => ({ ...p, model: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Bouwjaar * (min. 2000)</Label>
                <Input type="number" required min={2000} max={currentYear} value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Kilometerstand</Label>
                <Input type="number" value={form.mileage} onChange={e => setForm(p => ({ ...p, mileage: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Brandstof</Label>
                <Select value={form.fuel_type} onValueChange={v => setForm(p => ({ ...p, fuel_type: v }))}>
                  <SelectTrigger><SelectValue placeholder="Kies..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="benzine">Benzine</SelectItem>
                    <SelectItem value="elektrisch">Elektrisch</SelectItem>
                    <SelectItem value="hybride">Hybride</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Lengte (m)</Label>
                <Input type="number" step="0.1" value={form.length_m} onChange={e => setForm(p => ({ ...p, length_m: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Slaapplaatsen</Label>
                <Input type="number" value={form.sleeps} onChange={e => setForm(p => ({ ...p, sleeps: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Beschrijving van de camper</Label>
              <Textarea rows={3} placeholder="Staat, bijzonderheden, accessoires..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Extra bericht</Label>
              <Textarea rows={2} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
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
                "Campers vanaf bouwjaar 2000",
              ].map(p => (
                <li key={p} className="flex items-center gap-2 font-body text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 shrink-0 text-primary" /> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
