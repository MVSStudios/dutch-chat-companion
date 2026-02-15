import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, LogOut, Eye, MessageSquare, Search, Wrench, TrendingUp, ShoppingBag, Truck, Calendar, Mail, Phone, User } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import SeoManager from "@/components/admin/SeoManager";
import type { Tables } from "@/integrations/supabase/types";

type Motorhome = Tables<"motorhomes">;

const emptyForm = {
  title: "", description: "", price: "", year: "", brand: "", model: "",
  mileage: "", fuel_type: "", length_m: "", sleeps: "", features: "",
  status: "available" as string, images: [] as string[],
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [tab, setTab] = useState<string>("motorhomes");

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

  const { data: purchaseRequests } = useQuery({
    queryKey: ["admin-purchases"],
    queryFn: async () => {
      const { data, error } = await supabase.from("purchase_requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: montageAppointments } = useQuery({
    queryKey: ["admin-montage"],
    queryFn: async () => {
      const { data, error } = await supabase.from("montage_appointments").select("*").order("created_at", { ascending: false });
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
        images: form.images.length > 0 ? form.images : null,
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

  const deleteQuoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("quote_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-quotes"] });
      toast.success("Offerte verwijderd!");
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      toast.success("Bericht verwijderd!");
    },
  });

  const deletePurchaseMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("purchase_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-purchases"] });
      toast.success("Aankoopaanvraag verwijderd!");
    },
  });

  const deleteMontageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("montage_appointments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-montage"] });
      toast.success("Montage-afspraak verwijderd!");
    },
  });

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(false); };

  const openEdit = (m: Motorhome) => {
    setEditingId(m.id);
    setForm({
      title: m.title, description: m.description || "", price: m.price?.toString() || "",
      year: m.year?.toString() || "", brand: m.brand || "", model: m.model || "",
      mileage: m.mileage?.toString() || "", fuel_type: m.fuel_type || "",
      length_m: m.length_m?.toString() || "", sleeps: m.sleeps?.toString() || "",
      features: m.features?.join(", ") || "", status: m.status,
      images: m.images || [],
    });
    setDialogOpen(true);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/admin/login"); };

  const tabs = [
    { key: "motorhomes", label: "Motorhomes", icon: Truck },
    { key: "quotes", label: `Offertes (${quotes?.length || 0})`, icon: Eye },
    { key: "messages", label: `Berichten (${messages?.length || 0})`, icon: MessageSquare },
    { key: "purchases", label: `Aankoop (${purchaseRequests?.length || 0})`, icon: TrendingUp },
    { key: "montage", label: `Montage (${montageAppointments?.length || 0})`, icon: Wrench },
    { key: "seo", label: "SEO", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Beheerpaneel</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} size="sm" className="border-border hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="mr-2 h-4 w-4" /> Uitloggen
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tab navigation */}
        <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-card/30 p-2">
          {tabs.map(t => (
            <Button
              key={t.key}
              variant={tab === t.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setTab(t.key)}
              className={tab === t.key ? "shadow-md" : "text-muted-foreground hover:text-foreground"}
            >
              <t.icon className="mr-1.5 h-4 w-4" />
              {t.label}
            </Button>
          ))}
        </div>

        {/* Motorhomes tab */}
        {tab === "motorhomes" && (
          <>
            <div className="mt-6">
              <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setDialogOpen(open); }}>
                <DialogTrigger asChild>
                  <Button className="shadow-lg shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" />Motorhome toevoegen
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-heading">{editingId ? "Motorhome bewerken" : "Nieuwe motorhome"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Titel *</Label>
                      <Input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Merk</Label><Input value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} /></div>
                      <div className="space-y-2"><Label>Model</Label><Input value={form.model} onChange={e => setForm(p => ({ ...p, model: e.target.value }))} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Prijs (€)</Label><Input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} /></div>
                      <div className="space-y-2"><Label>Bouwjaar</Label><Input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Kilometerstand</Label><Input type="number" value={form.mileage} onChange={e => setForm(p => ({ ...p, mileage: e.target.value }))} /></div>
                      <div className="space-y-2"><Label>Brandstof</Label><Input value={form.fuel_type} onChange={e => setForm(p => ({ ...p, fuel_type: e.target.value }))} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Lengte (m)</Label><Input type="number" step="0.1" value={form.length_m} onChange={e => setForm(p => ({ ...p, length_m: e.target.value }))} /></div>
                      <div className="space-y-2"><Label>Slaapplaatsen</Label><Input type="number" value={form.sleeps} onChange={e => setForm(p => ({ ...p, sleeps: e.target.value }))} /></div>
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
                      <Label>Foto's</Label>
                      <ImageUpload images={form.images} onImagesChange={(imgs) => setForm(p => ({ ...p, images: imgs }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Beschrijving</Label>
                      <Textarea rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                    </div>
                    <Button type="submit" className="w-full shadow-lg shadow-primary/20" disabled={saveMutation.isPending}>
                      {saveMutation.isPending ? "Opslaan..." : editingId ? "Bijwerken" : "Toevoegen"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Motorhome table */}
            <div className="mt-6 overflow-hidden rounded-xl border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-card/60">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Motorhome</th>
                    <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Prijs</th>
                    <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Laden...</td></tr>
                  ) : motorhomes?.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Nog geen motorhomes toegevoegd.</td></tr>
                  ) : (
                    motorhomes?.map((m) => (
                      <tr key={m.id} className="transition-colors hover:bg-card/40">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {m.images?.[0] ? (
                              <img src={m.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover ring-1 ring-border" />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Truck className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-heading font-semibold text-foreground">{m.title}</p>
                              <p className="text-xs text-muted-foreground">{m.brand} {m.model} {m.year && `• ${m.year}`}</p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-4 py-3 md:table-cell">
                          <span className="font-semibold text-primary">
                            {m.price ? `€${m.price.toLocaleString("nl-BE")}` : "—"}
                          </span>
                        </td>
                        <td className="hidden px-4 py-3 sm:table-cell">
                          <Badge variant={m.status === "available" ? "default" : m.status === "sold" ? "destructive" : "secondary"}>
                            {m.status === "available" ? "Beschikbaar" : m.status === "sold" ? "Verkocht" : "Gereserveerd"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEdit(m)} className="h-8 w-8 p-0 text-muted-foreground hover:text-primary">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { if (confirm("Weet u zeker dat u deze motorhome wilt verwijderen?")) deleteMutation.mutate(m.id); }} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Quotes tab */}
        {tab === "quotes" && (
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card/60">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Klant</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Motorhome</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Datum</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {quotes?.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Geen offerte-aanvragen.</td></tr>
                ) : quotes?.map((q) => (
                  <tr key={q.id} className="transition-colors hover:bg-card/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{q.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" /> {q.email}
                            {q.phone && <><Phone className="ml-1 h-3 w-3" /> {q.phone}</>}
                          </div>
                          {q.message && <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">{q.message}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className="text-sm text-primary">{(q.motorhomes as any)?.title || "—"}</span>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(q.created_at).toLocaleDateString("nl-BE")}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm("Weet u zeker dat u deze offerte wilt verwijderen?")) deleteQuoteMutation.mutate(q.id); }} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Messages tab */}
        {tab === "messages" && (
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card/60">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Afzender</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Bericht</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Datum</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {messages?.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Geen berichten.</td></tr>
                ) : messages?.map((msg) => (
                  <tr key={msg.id} className="transition-colors hover:bg-card/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15">
                          <MessageSquare className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{msg.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" /> {msg.email}
                            {msg.phone && <><Phone className="ml-1 h-3 w-3" /> {msg.phone}</>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <div>
                        {msg.subject && <p className="text-sm font-medium text-foreground">{msg.subject}</p>}
                        <p className="max-w-sm truncate text-xs text-muted-foreground">{msg.message}</p>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(msg.created_at).toLocaleDateString("nl-BE")}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm("Weet u zeker dat u dit bericht wilt verwijderen?")) deleteMessageMutation.mutate(msg.id); }} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Purchase requests tab */}
        {tab === "purchases" && (
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card/60">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Klant</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Voertuig</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Datum</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {purchaseRequests?.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Geen aankoopaanvragen.</td></tr>
                ) : purchaseRequests?.map((pr) => (
                  <tr key={pr.id} className="transition-colors hover:bg-card/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{pr.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" /> {pr.email}
                            {pr.phone && <><Phone className="ml-1 h-3 w-3" /> {pr.phone}</>}
                          </div>
                          {pr.message && <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">{pr.message}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <p className="text-sm font-medium text-primary">{pr.brand} {pr.model}</p>
                      <p className="text-xs text-muted-foreground">{pr.year} {pr.mileage && `• ${pr.mileage.toLocaleString("nl-BE")} km`}</p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(pr.created_at).toLocaleDateString("nl-BE")}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm("Weet u zeker dat u deze aankoopaanvraag wilt verwijderen?")) deletePurchaseMutation.mutate(pr.id); }} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Montage appointments tab */}
        {tab === "montage" && (
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card/60">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Klant</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Service</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Datum</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {montageAppointments?.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Geen montage-afspraken.</td></tr>
                ) : montageAppointments?.map((ma) => (
                  <tr key={ma.id} className="transition-colors hover:bg-card/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15">
                          <Wrench className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{ma.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" /> {ma.email}
                            {ma.phone && <><Phone className="ml-1 h-3 w-3" /> {ma.phone}</>}
                          </div>
                          {ma.motorhome_info && <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">{ma.motorhome_info}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <Badge variant="secondary">{ma.service_type}</Badge>
                      {ma.preferred_date && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" /> {ma.preferred_date} {ma.preferred_time && `• ${ma.preferred_time}`}
                        </p>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(ma.created_at).toLocaleDateString("nl-BE")}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm("Weet u zeker dat u deze montage-afspraak wilt verwijderen?")) deleteMontageMutation.mutate(ma.id); }} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SEO tab */}
        {tab === "seo" && (
          <div className="mt-6">
            <SeoManager />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
