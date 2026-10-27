# Roamly Frontend

Roamly is a responsive frontend built with Next.js App Router, React,
TypeScript, and Tailwind CSS. It currently uses local sample data and
placeholder content where screens or account-backed behavior are not connected.
There is no backend or database in this project.

## Requirements

- Node.js 20.9 or newer
- pnpm 10

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Run the available quality
checks with:

```bash
pnpm lint
pnpm build
```

## Routes

| Screen | Route | Status |
| --- | --- | --- |
| Home | `/` | Responsive homepage |
| Trip Preferences | `/preferences` | Frontend form; values are carried in URL parameters |
| Itinerary Selection | `/trips/[tripId]` | Local sample plans |
| Explore Discovery | `/explore` | Local Jaipur sample places and illustrative map |
| Itinerary Editor | `/trips/[tripId]/explore` | Frontend-only editor and illustrative map |
| Trip Overview | `/trips/[tripId]/overview` | Placeholder |

The navbar AI Credits indicator is currently a static zero; it is not connected
to an account balance. Search, filters, and itinerary edits are local UI state.

## Project structure

- `public/images/` — images and branding used by the UI.
- `src/app/` — App Router entries, root layout, and global styles.
- `src/components/layout/` — shared navbar and footer.
- `src/components/shared/` — shared application components.
- `src/components/ui/` — reusable generic UI components.
- `src/features/` — route-specific UI and sample data grouped by feature.

Design tokens are defined as CSS custom properties in `src/app/globals.css`
and exposed as Tailwind colors in `tailwind.config.ts`.
