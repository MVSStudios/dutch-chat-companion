import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, LogOut, Eye, MessageSquare } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Motorhome = Tables<"motorhomes">;

const emptyForm = {
  title: "",
  description: "",
  price: "",
  year: "",
  brand: "",
  model: "",
  mileage: "",
  fuel_type: "",
  length_m: "",
  sleeps: "",
  features: "",
  status: "available" as string,
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [tab, setTab] = useState<"motorhomes" | "quotes" | "messages">("motorhomes");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin/login");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/admin/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: motorhomes, isLoading } = useQuery({
    queryKey: ["admin-motorhomes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("motorhomes").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: quotes } = useQuery({
    queryKey: ["admin-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quote_requests").select("*, motorhomes(title)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: messages } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        description: form.description || null,
        price: form.price ? Number(form.price) : null,
        year: form.year ? Number(form.year) : null,
        brand: form.brand || null,
        model: form.model || null,
        mileage: form.mileage ? Number(form.mileage) : null,
        fuel_type: form.fuel_type || null,
        length_m: form.length_m ? Number(form.length_m) : null,
        sleeps: form.sleeps ? Number(form.sleeps) : null,
        features: form.features ? form.features.split(",").map(f => f.trim()).filter(Boolean) : null,
        status: form.status,
      };

      if (editingId) {
        const { error } = await supabase.from("motorhomes").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("motorhomes").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-motorhomes"] });
      toast.success(editingId ? "Motorhome bijgewerkt!" : "Motorhome toegevoegd!");
      resetForm();
    },
    onError: () => toast.error("Er ging iets mis."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("motorhomes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-motorhomes"] });
      toast.success("Motorhome verwijderd!");
    },
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(false);
  };

  const openEdit = (m: Motorhome) => {
    setEditingId(m.id);
    setForm({
      title: m.title,
      description: m.description || "",
      price: m.price?.toString() || "",
      year: m.year?.toString() || "",
      brand: m.brand || "",
      model: m.model || "",
      mileage: m.mileage?.toString() || "",
      fuel_type: m.fuel_type || "",
      length_m: m.length_m?.toString() || "",
      sleeps: m.sleeps?.toString() || "",
      features: m.features?.join(", ") || "",
      status: m.status,
    });
    setDialogOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">Beheerpaneel</h1>
        <Button variant="outline" onClick={handleLogout} size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Uitloggen
        </Button>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2">
        <Button variant={tab === "motorhomes" ? "default" : "outline"} size="sm" onClick={() => setTab("motorhomes")}>
          Motorhomes
        </Button>
        <Button variant={tab === "quotes" ? "default" : "outline"} size="sm" onClick={() => setTab("quotes")}>
          <Eye className="mr-1 h-4 w-4" />
          Offertes ({quotes?.length || 0})
        </Button>
        <Button variant={tab === "messages" ? "default" : "outline"} size="sm" onClick={() => setTab("messages")}>
          <MessageSquare className="mr-1 h-4 w-4" />
          Berichten ({messages?.length || 0})
        </Button>
      </div>

      {tab === "motorhomes" && (
        <>
          <div className="mt-6">
            <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setDialogOpen(open); }}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" />Motorhome toevoegen</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-heading">
                    {editingId ? "Motorhome bewerken" : "Nieuwe motorhome"}
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label>Titel *</Label>
                    <Input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Merk</Label>
                      <Input value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Input value={form.model} onChange={e => setForm(p => ({ ...p, model: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Prijs (€)</Label>
                      <Input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Bouwjaar</Label>
                      <Input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Kilometerstand</Label>
                      <Input type="number" value={form.mileage} onChange={e => setForm(p => ({ ...p, mileage: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Brandstof</Label>
                      <Input value={form.fuel_type} onChange={e => setForm(p => ({ ...p, fuel_type: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Beschikbaar</SelectItem>
                        <SelectItem value="reserved">Gereserveerd</SelectItem>
                        <SelectItem value="sold">Verkocht</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Kenmerken (komma-gescheiden)</Label>
                    <Input placeholder="Airco, Zonnepaneel, ..." value={form.features} onChange={e => setForm(p => ({ ...p, features: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Beschrijving</Label>
                    <Textarea rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Opslaan..." : editingId ? "Bijwerken" : "Toevoegen"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-6 space-y-3">
            {isLoading ? (
              <p className="text-muted-foreground">Laden...</p>
            ) : motorhomes?.length === 0 ? (
              <p className="text-muted-foreground">Nog geen motorhomes toegevoegd.</p>
            ) : (
              motorhomes?.map((m) => (
                <Card key={m.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{m.title}</h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        {m.price && <span>€{m.price.toLocaleString("nl-BE")}</span>}
                        {m.brand && <span>• {m.brand}</span>}
                        {m.year && <span>• {m.year}</span>}
                        <Badge variant={m.status === "available" ? "default" : m.status === "sold" ? "destructive" : "secondary"}>
                          {m.status === "available" ? "Beschikbaar" : m.status === "sold" ? "Verkocht" : "Gereserveerd"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(m)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm("Weet u zeker dat u deze motorhome wilt verwijderen?"))
                            deleteMutation.mutate(m.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}

      {tab === "quotes" && (
        <div className="mt-6 space-y-3">
          {quotes?.length === 0 ? (
            <p className="text-muted-foreground">Geen offerte-aanvragen.</p>
          ) : (
            quotes?.map((q) => (
              <Card key={q.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-heading font-semibold text-foreground">{q.name}</p>
                      <p className="text-sm text-muted-foreground">{q.email} {q.phone && `• ${q.phone}`}</p>
                      {(q.motorhomes as any)?.title && (
                        <p className="mt-1 text-sm text-primary">Motorhome: {(q.motorhomes as any).title}</p>
                      )}
                      {q.message && <p className="mt-2 text-sm text-foreground">{q.message}</p>}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(q.created_at).toLocaleDateString("nl-BE")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === "messages" && (
        <div className="mt-6 space-y-3">
          {messages?.length === 0 ? (
            <p className="text-muted-foreground">Geen berichten.</p>
          ) : (
            messages?.map((msg) => (
              <Card key={msg.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-heading font-semibold text-foreground">{msg.name}</p>
                      <p className="text-sm text-muted-foreground">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
                      {msg.subject && <p className="mt-1 text-sm font-medium text-foreground">{msg.subject}</p>}
                      <p className="mt-1 text-sm text-foreground">{msg.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleDateString("nl-BE")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
