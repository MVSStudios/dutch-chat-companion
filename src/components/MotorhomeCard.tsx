import { Link } from "react-router-dom";
import { Fuel, Ruler, Users, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MotorhomeCardProps {
  id: string;
  title: string;
  price: number | null;
  year: number | null;
  brand: string | null;
  fuel_type: string | null;
  length_m: number | null;
  sleeps: number | null;
  images: string[] | null;
  status: string;
}

const MotorhomeCard = ({ id, title, price, year, fuel_type, length_m, sleeps, images, status }: MotorhomeCardProps) => {
  const imageUrl = images?.[0] || "/placeholder.svg";
  const statusLabel = status === "sold" ? "Verkocht" : status === "reserved" ? "Gereserveerd" : null;

  return (
    <Card className="group overflow-hidden border-border shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {statusLabel && (
          <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">
            {statusLabel}
          </Badge>
        )}
      </div>
      <CardContent className="p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground line-clamp-1">{title}</h3>
        {price && (
          <p className="mt-1 font-heading text-xl font-bold text-primary">
            €{price.toLocaleString("nl-BE")}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          {year && (
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{year}</span>
          )}
          {fuel_type && (
            <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5" />{fuel_type}</span>
          )}
          {length_m && (
            <span className="flex items-center gap-1"><Ruler className="h-3.5 w-3.5" />{length_m}m</span>
          )}
          {sleeps && (
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{sleeps} pers.</span>
          )}
        </div>
        <Button asChild variant="outline" className="mt-4 w-full">
          <Link to={`/motorhomes/${id}`}>Bekijk details</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default MotorhomeCard;
