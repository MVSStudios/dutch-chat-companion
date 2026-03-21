

## Plan: Transmissie-veld toevoegen aan motorhomes

### Wat er verandert

Een "Transmissie" veld toevoegen zodat je bij het aanmaken/bewerken van een motorhome kunt kiezen tussen bijv. "Manueel" en "Automaat". Dit veld wordt ook getoond op de detailpagina en optioneel op de kaart.

### Stappen

1. **Database migratie** -- Kolom `transmission` (text, nullable) toevoegen aan de `motorhomes` tabel.

2. **Admin formulier (`src/pages/AdminDashboard.tsx`)** -- `transmission` toevoegen aan `emptyForm`, het opslaan (payload), het laden bij bewerken, en een Select-veld in het formulier met opties "Manueel" / "Automaat" / "Semi-automaat".

3. **Detailpagina (`src/pages/MotorhomeDetail.tsx`)** -- Transmissie toevoegen aan de `specs` array zodat het getoond wordt bij de specificaties.

4. **Motorhome kaart (`src/components/MotorhomeCard.tsx`)** -- Optioneel transmissie tonen als extra spec-item.

### Technisch detail

- Migratie SQL: `ALTER TABLE public.motorhomes ADD COLUMN transmission text;`
- Na migratie wordt `types.ts` automatisch bijgewerkt met het nieuwe veld.
- Geen RLS-wijzigingen nodig (bestaande policies volstaan).

