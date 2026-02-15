import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface QuoteRequestFormProps {
  motorhomeId: string;
  motorhomeTitle: string;
}

const QuoteRequestForm = ({ motorhomeId, motorhomeTitle }: QuoteRequestFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("quote_requests").insert({
      motorhome_id: motorhomeId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      message: formData.message || null,
    });

    if (!error) {
      supabase.functions.invoke("send-notification-email", {
        body: {
          type: "quote",
          data: { ...formData, motorhome: motorhomeTitle },
        },
      });
    }

    setLoading(false);
    if (error) {
      toast.error("Er ging iets mis. Probeer het opnieuw.");
      return;
    }
    toast.success("Uw offerte-aanvraag is verstuurd!");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-heading text-xl font-semibold text-foreground">Offerte aanvragen</h3>
      <p className="font-body text-sm text-muted-foreground">Voor: <strong>{motorhomeTitle}</strong></p>
      <div className="space-y-2">
        <Label htmlFor="name">Naam *</Label>
        <Input id="name" required value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail *</Label>
        <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telefoon *</Label>
        <Input id="phone" type="tel" required value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Bericht *</Label>
        <Textarea id="message" rows={4} required placeholder="Stel uw vragen of vertel ons wat u zoekt..." value={formData.message} onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Versturen..." : "Offerte aanvragen"}
      </Button>
    </form>
  );
};

export default QuoteRequestForm;
