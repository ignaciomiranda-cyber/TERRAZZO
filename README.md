# instone

Company website for Instone — built with [Next.js](https://nextjs.org) 16, TypeScript, and Tailwind CSS.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | Run ESLint |

## CI/CD

Every push to `main` runs the GitHub Actions workflow in `.github/workflows/ci.yml`:

1. **Lint** — `npm run lint`
2. **Build** — `npm run build`

## Deploying to Vercel

The fastest path to production:

1. Push the repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Vercel detects Next.js automatically — hit **Deploy**

After the first import, every push to `main` triggers an automatic deploy.

### Manual one-command deploy (Vercel CLI)

```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages (static export)

If you prefer GitHub Pages, add `output: "export"` to `next.config.ts`, then the CI workflow can publish the `out/` folder to the `gh-pages` branch.
