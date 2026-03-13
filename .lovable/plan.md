

## Plan: Openingsuren toevoegen aan de contactpagina

### Wat
Onder het infokader in de "Waar vindt u ons?" sectie op de contactpagina een openingsuren-blok toevoegen met een klok-icoon en alle dagen.

### Hoe
**Bestand: `src/components/LocationSection.tsx`**
- Na het bestaande infokader (regel 30, na de `</div>` van het adres-blok) een nieuw blok toevoegen met een `Clock` icoon en de openingsuren in een overzichtelijke lijst:
  - Maandag: 8:30 - 12:00 / 13:00 - 18:00
  - Dinsdag: 8:30 - 12:00 / 13:00 - 18:00
  - Woensdag: 13:00 - 17:00
  - Donderdag: 13:00 - 18:00
  - Vrijdag: 13:00 - 18:00
  - Zaterdag: 9:00 - 15:00
  - Zondag: Enkel telefonisch bereikbaar

- Styling: zelfde `rounded-xl border border-border bg-card p-8` kader als het adresblok, geplaatst direct eronder (binnen dezelfde kolom).
- Import `Clock` van lucide-react toevoegen.

