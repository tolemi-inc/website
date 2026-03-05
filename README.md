# Tolemi Website

Marketing website for Tolemi, built with [Astro](https://astro.build) and [TinaCMS](https://tina.io). Styled with [Tailwind CSS](https://tailwindcss.com).

## Commands

All commands are run from the root of the project:

| Command           | Action                                                       |
| :---------------- | :----------------------------------------------------------- |
| `npm install`     | Install dependencies                                         |
| `npm run dev`     | Start dev server with TinaCMS at `localhost:4321`            |
| `npm run build`   | Build TinaCMS and Astro for production to `./dist/`          |
| `npm run preview` | Preview the production build locally                         |

Running `npm run dev` starts both Astro and the TinaCMS local server. The CMS admin UI is available at `localhost:4321/admin/`.

## Project Structure

```
/
├── content/                 # All CMS-managed content (JSON files)
│   ├── about/               #   About page
│   ├── careers/             #   Careers page and job listings
│   ├── global/              #   Site-wide settings (nav, footer, social links)
│   ├── pages/               #   Block-based pages (home)
│   ├── products/            #   Product pages (building-blocks, publicity, slate)
│   ├── solutions/           #   Solution pages (code-enforcement, rental registration)
│   └── team/                #   Team members
├── public/
│   ├── admin/               #   TinaCMS admin UI (generated, gitignored contents)
│   ├── city_seals/          #   City seal images
│   ├── logos/               #   Company and investor logos
│   ├── maps/                #   Map data files (GeoJSON, PMTiles)
│   └── screenshots/         #   Product screenshots
├── src/
│   ├── components/
│   │   ├── blocks/          #   Reusable content blocks (Hero, Features, Stats, etc.)
│   │   └── layout/          #   Header and Footer
│   ├── layouts/
│   │   └── Base.astro       #   Base HTML layout
│   ├── logos/               #   Logo SVGs used in components
│   ├── pages/
│   │   ├── index.astro      #   Home page
│   │   ├── about.astro      #   About page
│   │   ├── careers.astro    #   Careers page
│   │   ├── team.astro       #   Team page
│   │   ├── products/[slug].astro    # Dynamic product pages
│   │   └── solutions/[slug].astro   # Dynamic solution pages
│   └── styles/
│       └── global.css       #   Global styles and Tailwind imports
├── tina/
│   ├── config.ts            #   TinaCMS schema and collection definitions
│   └── __generated__/       #   Auto-generated types and queries (gitignored)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Updating Content

### Using the CMS (no coding required)

TinaCMS provides a visual editing interface for all site content. You don't need to touch any code to update text, add team members, post jobs, or manage pages.

**Getting started:**

1. Ask a developer to start the local dev server (`npm run dev`)
2. Open your browser to `http://localhost:4321/admin/`
3. You'll see a sidebar listing all content sections (Pages, Products, Solutions, Team, etc.)
4. Click into any section, then click the item you want to edit
5. Make your changes in the form fields — you'll see a live preview on the right
6. Click **Save** when you're done. Your changes are saved to the project files automatically.

**Common tasks:**

- **Edit the homepage:** Go to Pages > home. The page is built from blocks (Hero, Features, Stats, etc.) that you can reorder and edit individually.
- **Update navigation or footer:** Go to Global Settings > site. You can add, remove, or reorder nav links and update social links and footer text.
- **Add a team member:** Go to Team > team, scroll to the Members list, and click "Add Team Members" to create a new entry with name, title, bio, and photo.
- **Post a job opening:** Go to Careers > careers, scroll to Job Postings, and click "Add Job Postings" to fill in title, department, location, type, and apply link.
- **Add a new product or solution:** Go to Products or Solutions, click "Create New", and fill in the title, slug (this becomes the URL, e.g. `my-product` becomes `/products/my-product`), and content fields.
- **Upload images:** When editing a photo or image field, TinaCMS lets you upload files directly. Uploaded media is stored in `public/uploads/`.

**Tips:**

- The slug field on Products and Solutions controls the page URL — use lowercase words separated by hyphens (e.g. `short-term-rental-registration`).
- Changes are saved to local files. A developer will need to commit and deploy them for changes to go live.
- If something looks wrong, you can always undo by asking a developer to revert the changes in git.

### Editing JSON directly

All content lives in `content/` as JSON files. Each file maps to a TinaCMS collection defined in `tina/config.ts`.

**Content collections:**

| Collection       | Path                    | Description                                      |
| :--------------- | :---------------------- | :----------------------------------------------- |
| Pages            | `content/pages/`        | Block-based pages (hero, features, stats, etc.)  |
| Global Settings  | `content/global/`       | Nav links, footer text, social links             |
| Products         | `content/products/`     | One JSON file per product; uses `slug` for URL   |
| Solutions        | `content/solutions/`    | One JSON file per solution; uses `slug` for URL  |
| About            | `content/about/`        | About page: history, milestones                  |
| Team             | `content/team/`         | Team member list with bios and photos            |
| Careers          | `content/careers/`      | Job listings, culture section, featured posts    |

### Adding a new product or solution page

1. Create a new JSON file in `content/products/` or `content/solutions/`
2. Include at minimum `title` and `slug` fields
3. The dynamic route (`src/pages/products/[slug].astro`) picks it up automatically

### Map data

Static map assets in `public/maps/` include GeoJSON, PMTiles, and QMD files used by the MapExplorer component. To update map data, replace the files in that directory and rebuild.

## TinaCMS Schema

The content schema is defined in `tina/config.ts`. To add new fields or collections, edit that file — TinaCMS will regenerate types on the next dev server start.

Key block templates available for block-based pages: **Hero**, **Features**, **Stats**, **Testimonials**, **Call to Action**.
