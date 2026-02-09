import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject || null,
      message: form.message,
    });
    setLoading(false);
    if (error) {
      toast.error("Er ging iets mis. Probeer het opnieuw.");
      return;
    }
    toast.success("Uw bericht is verstuurd! Wij nemen zo snel mogelijk contact op.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const info = [
    { icon: Phone, label: "Telefoon", value: "+32 123 45 67 89" },
    { icon: Mail, label: "E-mail", value: "info@jcmotorhomes.be" },
    { icon: MapPin, label: "Locatie", value: "België" },
    { icon: Clock, label: "Openingstijden", value: "Ma-Vr: 9:00 - 18:00\nZa: 10:00 - 16:00" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Contact</h1>
      <p className="mt-2 font-body text-muted-foreground">
        Heeft u een vraag of wilt u een afspraak maken? Neem gerust contact met ons op.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-name">Naam *</Label>
                <Input id="c-name" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-email">E-mail *</Label>
                <Input id="c-email" type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-phone">Telefoon</Label>
                <Input id="c-phone" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-subject">Onderwerp</Label>
                <Input id="c-subject" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-message">Bericht *</Label>
              <Textarea id="c-message" rows={5} required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Versturen..." : "Verstuur bericht"}
            </Button>
          </form>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          {info.map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">{item.label}</h3>
                <p className="whitespace-pre-line font-body text-sm text-muted-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
