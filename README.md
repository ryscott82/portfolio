# portfolio

Personal portfolio of Ryan Edward Scott: a black leather binder on an oak table. Section tabs, page turns you can drag, things to pick up off the table, and a plain view for anyone in a hurry.

## Run it locally

The site is plain HTML, CSS and JavaScript with no build step. Browsers won't load JavaScript modules from `file://`, so serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Edit the content

All the words live in `js/content.js`:

- `CONTACT` — email, résumé file name, LinkedIn, Instagram, YouTube, REMG site.
- `SECTIONS` — each section (one tab) and its pages, in order. Each section needs an even number of pages (they come in spreads).
- `PROGRAM`, `POSTCARD`, `POCKET` — the pull-outs.

Photos go in `assets/photos/`. Things still to fill in are written in `[BRACKETS]`.

**Résumé:** put your PDF at the root of the repo as `resume.pdf` (or change `CONTACT.resume`).

## Links to a page

Every spread has its own address, e.g. `/#theater`, `/#ftc`, `/#haitian-relief`, `/#mela-know-more`. The slugs are the `slug` fields in `js/content.js`.

## Publish on GitHub Pages

1. Push to GitHub.
2. Repo → Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. For ryanedwardscott.com: add the domain under Settings → Pages → Custom domain (this creates a `CNAME` file), then point the domain's DNS at GitHub Pages and turn on *Enforce HTTPS*.

## Files

```
index.html            page shell
css/site.css          all styles
js/app.js             the binder: layout, page turning, lighting, table items, phone layout, plain view
js/content.js         the words
js/vendor/            Preact + htm (standalone, unmodified)
assets/textures/      oak, leather, paper
assets/photos/        photos from ryanedwardscott.com
```
