# Markdown to HTML Converter

A lightweight Markdown to HTML converter built for GitHub Pages with local development support via `pnpm` and Docker.

## Features

- Paste Markdown into the left editor
- View generated HTML on the right
- Preview rendered HTML
- Copy HTML to clipboard with one click

## Local development

All commands run inside Docker using Docker Compose. The source code is mounted into the container, and `node_modules` is stored in a Docker volume so it does not appear on your host.

```bash
docker compose up --build
```

Open `http://localhost:5173` in your browser.

## Build

Build the production output inside Docker:

```bash
docker compose run --rm app pnpm build
```

The static site will be available in `dist/` locally.

## Docker

The repository includes a Docker development container and a production image.

Build the production image:

```bash
docker build -t markdowntohtml .
```

Run the production site:

```bash
docker run --rm -p 8080:80 markdowntohtml
```

Then open `http://localhost:8080`.

## Live site

[https://jorgetutor.github.io/markdown-to-html/](https://jorgetutor.github.io/markdown-to-html/)

## GitHub Pages

Pushes to `main` trigger a GitHub Actions workflow that builds the site and deploys it automatically.

To enable on a fork:
1. Go to **Settings → Pages** and set Source to **GitHub Actions**.
2. Push to `main`.
