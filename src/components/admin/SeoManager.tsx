import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";

const SeoManager = () => {
  const queryClient = useQueryClient();

  const { data: seoSettings, isLoading } = useQuery({
    queryKey: ["admin-seo"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seo_settings")
        .select("*")
        .order("page_slug");
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (setting: { id: string; page_title: string | null; meta_description: string | null; og_title: string | null; og_description: string | null; og_image: string | null }) => {
      const { error } = await supabase
        .from("seo_settings")
        .update({
          page_title: setting.page_title,
          meta_description: setting.meta_description,
          og_title: setting.og_title,
          og_description: setting.og_description,
          og_image: setting.og_image,
        })
        .eq("id", setting.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-seo"] });
      toast.success("SEO instellingen opgeslagen!");
    },
    onError: () => toast.error("Er ging iets mis."),
  });

  if (isLoading) return <p className="text-muted-foreground">Laden...</p>;

  return (
    <div className="space-y-4">
      {seoSettings?.map((s) => (
        <SeoCard key={s.id} setting={s} onSave={(data) => updateMutation.mutate(data)} saving={updateMutation.isPending} />
      ))}
    </div>
  );
};

const SeoCard = ({ setting, onSave, saving }: { setting: any; onSave: (data: any) => void; saving: boolean }) => {
  const [form, setForm] = useState({
    page_title: setting.page_title || "",
    meta_description: setting.meta_description || "",
    og_title: setting.og_title || "",
    og_description: setting.og_description || "",
    og_image: setting.og_image || "",
  });

  useEffect(() => {
    setForm({
      page_title: setting.page_title || "",
      meta_description: setting.meta_description || "",
      og_title: setting.og_title || "",
      og_description: setting.og_description || "",
      og_image: setting.og_image || "",
    });
  }, [setting]);

  const slugLabels: Record<string, string> = {
    home: "Home",
    motorhomes: "Aanbod",
    diensten: "Diensten",
    contact: "Contact",
    aankoop: "Aankoop",
    montage: "Montage",
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-base">{slugLabels[setting.page_slug] || setting.page_slug}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs">Paginatitel (max 60 tekens)</Label>
          <Input
            maxLength={60}
            value={form.page_title}
            onChange={e => setForm(p => ({ ...p, page_title: e.target.value }))}
            placeholder="Paginatitel..."
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Meta beschrijving (max 160 tekens)</Label>
          <Textarea
            maxLength={160}
            rows={2}
            value={form.meta_description}
            onChange={e => setForm(p => ({ ...p, meta_description: e.target.value }))}
            placeholder="Meta beschrijving..."
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">OG Titel</Label>
            <Input value={form.og_title} onChange={e => setForm(p => ({ ...p, og_title: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">OG Afbeelding URL</Label>
            <Input value={form.og_image} onChange={e => setForm(p => ({ ...p, og_image: e.target.value }))} />
          </div>
        </div>
        <Button
          size="sm"
          disabled={saving}
          onClick={() => onSave({ id: setting.id, ...form })}
        >
          <Save className="mr-1 h-4 w-4" />
          Opslaan
        </Button>
      </CardContent>
    </Card>
  );
};

export default SeoManager;
