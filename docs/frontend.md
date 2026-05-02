# Frontend

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- MUI theme/components

## Main files

- `src/app/page.tsx`: page shell.
- `src/components/deploy-form/DeployForm.tsx`: form state and API submit.
- `src/components/deploy-form/EnvVariableInput.tsx`: dynamic env rows.
- `src/components/deploy-form/ServiceOptions.tsx`: optional service checkboxes.
- `src/components/preview/ConfigPreview.tsx`: generated config display.
- `src/lib/api.ts`: backend API client.
- `src/lib/download.ts`: file download helper.

## Run

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.
