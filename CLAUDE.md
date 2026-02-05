# CLAUDE.md

## Project Overview

This is Gustavo Valente's personal GitHub Pages website hosted at [gustavovalente.com](https://gustavovalente.com).

## Technology Stack

- **Platform**: GitHub Pages
- **Static Site Generator**: Jekyll
- **Theme**: jekyll-theme-minimal

## Project Structure

```
/
├── _config.yml    # Jekyll configuration
├── CNAME          # Custom domain configuration
├── index.md       # Main homepage content
└── CLAUDE.md      # This file
```

## Development

### Local Development

To run locally with Jekyll:

```bash
bundle install
bundle exec jekyll serve
```

Then visit `http://localhost:4000`

### Adding Content

- Edit `index.md` to update the homepage
- Add new `.md` files for additional pages
- Jekyll will automatically process Markdown files with front matter

### Configuration

- `_config.yml` - Jekyll settings and theme configuration
- `CNAME` - Custom domain (gustavovalente.com)

## Deployment

Changes pushed to the main branch are automatically deployed via GitHub Pages.
