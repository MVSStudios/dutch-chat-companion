import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-heading text-2xl font-bold">J&C Motorhomes</h3>
            <p className="mt-3 font-body text-sm opacity-80">
              Uw specialist in aankoop, verkoop, montage en advies van motorhomes.
              Al jarenlang uw betrouwbare partner.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold">Navigatie</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link to="/" className="font-body text-sm opacity-80 transition-opacity hover:opacity-100">Home</Link>
              <Link to="/motorhomes" className="font-body text-sm opacity-80 transition-opacity hover:opacity-100">Aanbod</Link>
              <Link to="/aankoop" className="font-body text-sm opacity-80 transition-opacity hover:opacity-100">Aankoop</Link>
              <Link to="/montage" className="font-body text-sm opacity-80 transition-opacity hover:opacity-100">Montage</Link>
              <Link to="/diensten" className="font-body text-sm opacity-80 transition-opacity hover:opacity-100">Diensten</Link>
              <Link to="/contact" className="font-body text-sm opacity-80 transition-opacity hover:opacity-100">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold">Contact</h4>
            <div className="mt-3 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm opacity-80">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+32 123 45 67 89</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@jc-motorhomes.be</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>België</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/20 pt-6 text-center font-body text-sm opacity-60">
          © {new Date().getFullYear()} J&C Motorhomes. Alle rechten voorbehouden.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
