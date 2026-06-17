# GitHub Pages Deployment for Quartz

## Prerequisites
- GitHub repository created (public or private)
- Quartz synced to the repo via `npx quartz sync`

## Configuration

### 1. Enable GitHub Pages
1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**

### 2. Create Workflow File
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Quartz site to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

concurrency:
  group: "pages"
  cancel-in-progress: false

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Build Quartz
        run: npx quartz build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. Update quartz.config.yaml
Set the correct base URL:
```yaml
configuration:
  baseUrl: username.github.io/repo-name
```

### 4. Push and Deploy
```bash
npx quartz sync
```

The workflow will trigger automatically on push to `main`.

## Custom Domain (Optional)
1. In repository Settings → Pages, enter your custom domain
2. Quartz will auto-generate a `CNAME` file in `public/`
3. Configure DNS:
   - A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - CNAME: `username.github.io` (for www subdomain)

## Troubleshooting

**Build fails in GitHub Actions:**
- Check Node.js version is 22+
- Ensure `npm ci` succeeds (lockfile must be committed)
- Verify `.quartz/plugins/` directory is committed (not in `.gitignore`)

**404 errors on page load:**
- Check `baseUrl` in `quartz.config.yaml` matches your deployment URL
- For user/org pages (`username.github.io`), set `baseUrl: username.github.io`
- For project pages (`username.github.io/repo`), set `baseUrl: username.github.io/repo`

**Assets not loading:**
- Ensure paths in generated HTML are relative, not absolute
- Check browser console for 404 errors on CSS/JS files
