import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Wrench, CheckCircle } from "lucide-react";

const serviceTypes = [
  "Zonnepanelen & energiesystemen",
  "Satelliet- & TV-installaties",
  "Fietsendragers & accessoires",
  "Alarmsystemen & beveiliging",
  "Markiezen & luifels",
  "Verwarmingssystemen",
  "Overig",
];


const Montage = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", service_type: "",
    motorhome_info: "", message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("montage_appointments").insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      service_type: form.service_type,
      motorhome_info: form.motorhome_info || null,
      message: form.message || null,
    });

    if (!error) {
      supabase.functions.invoke("send-notification-email", {
        body: { type: "montage", data: form },
      });
    }

    setLoading(false);
    if (error) {
      toast.error("Er ging iets mis. Probeer het opnieuw.");
      return;
    }
    toast.success("Uw afspraak is aangevraagd! Wij bevestigen zo snel mogelijk.");
    setForm({ name: "", email: "", phone: "", service_type: "", motorhome_info: "", message: "" });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Wrench className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Montage afspraak
          </h1>
          <p className="mt-2 font-body text-muted-foreground">
            Plan een afspraak met een van onze monteurs voor professionele installatie.
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
              <Label>Telefoon *</Label>
              <Input type="tel" required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>

            <h2 className="font-heading text-xl font-semibold text-foreground pt-4">Afspraak details</h2>
            <div className="space-y-2">
              <Label>Type dienst *</Label>
              <Select required value={form.service_type} onValueChange={v => setForm(p => ({ ...p, service_type: v }))}>
                <SelectTrigger><SelectValue placeholder="Kies een dienst..." /></SelectTrigger>
                <SelectContent>
                  {serviceTypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Info over uw motorhome</Label>
              <Input placeholder="Bv. Fiat Ducato 2019, 7m" value={form.motorhome_info} onChange={e => setForm(p => ({ ...p, motorhome_info: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Extra bericht</Label>
              <Textarea rows={3} placeholder="Beschrijf wat u wilt laten installeren..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Versturen..." : "Afspraak aanvragen"}
            </Button>
          </form>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground">Onze montage diensten</h3>
            <ul className="mt-4 space-y-3">
              {serviceTypes.filter(s => s !== "Overig").map(s => (
                <li key={s} className="flex items-center gap-2 font-body text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 shrink-0 text-primary" /> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground">Waarom bij ons?</h3>
            <ul className="mt-4 space-y-3">
              {["Ervaren monteur", "Kwaliteitsgarantie", "Scherpe prijzen", "Snelle service"].map(p => (
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

export default Montage;
