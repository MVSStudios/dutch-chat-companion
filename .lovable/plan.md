

## Plan: Website Google-compatibel maken

### Wat er verandert

De `#` uit de URL's verwijderen zodat Google alle pagina's kan indexeren, plus een sitemap en bijgewerkte robots.txt.

### Stappen

1. **HashRouter → BrowserRouter** (`src/App.tsx`)
   - `HashRouter` vervangen door `BrowserRouter`
   - Alle interne `<Link>` componenten blijven werken (ze gebruiken al relatieve paden)

2. **`.htaccess` toevoegen** (`public/.htaccess`)
   - Zorgt dat Hostinger alle routes naar `index.html` stuurt
   - Zonder dit krijg je een 404 bij direct bezoek of pagina-refresh op bijv. `/motorhomes`

3. **Sitemap toevoegen** (`public/sitemap.xml`)
   - Alle publieke pagina's: `/`, `/motorhomes`, `/verkoop`, `/montage`, `/contact`

4. **Robots.txt bijwerken** (`public/robots.txt`)
   - Verwijzing naar de sitemap toevoegen

### Compatibiliteitscheck

- **9 bestanden** gebruiken `Link`, `useNavigate`, of `useLocation` — deze werken identiek met `BrowserRouter`, geen wijzigingen nodig
- **NotFound pagina**: de `<a href="/">` link in NotFound.tsx werkt ook correct
- **Admin routes**: `/admin` en `/admin/login` blijven werken
- **Dynamische routes**: `/motorhomes/:id` blijft werken

### Aandachtspunt

Na publicatie moet je op Hostinger controleren dat de `.htaccess` correct wordt toegepast. Bij Hostinger met Apache is dit standaard het geval.

