import { config, collection, singleton, fields } from '@keystatic/core';

// ---------------------------------------------------------------------------
// Reusable field groups
// ---------------------------------------------------------------------------

const heroFields = {
  headline: fields.text({ label: 'Headline', validation: { isRequired: true } }),
  subheadline: fields.text({ label: 'Sub-headline' }),
  ctaText: fields.text({ label: 'CTA Button Text' }),
  ctaLink: fields.text({ label: 'CTA Button Link' }),
};

const featureItem = fields.object({
  label: 'Feature Item',
  fields: {
    title: fields.text({ label: 'Title', validation: { isRequired: true } }),
    description: fields.text({ label: 'Description', multiline: true }),
    icon: fields.text({ label: 'Icon (emoji or text)' }),
  },
});

const statItem = fields.object({
  label: 'Stat Item',
  fields: {
    value: fields.text({ label: 'Value', validation: { isRequired: true } }),
    label: fields.text({ label: 'Label', validation: { isRequired: true } }),
  },
});

const testimonialItem = fields.object({
  label: 'Testimonial',
  fields: {
    quote: fields.text({ label: 'Quote', multiline: true, validation: { isRequired: true } }),
    author: fields.text({ label: 'Author Name' }),
    role: fields.text({ label: 'Author Role' }),
  },
});

const navChild = fields.object({
  label: 'Nav Child Link',
  fields: {
    label: fields.text({ label: 'Label', validation: { isRequired: true } }),
    href: fields.text({ label: 'URL', validation: { isRequired: true } }),
  },
});

// ---------------------------------------------------------------------------
// Block templates for the home page
// ---------------------------------------------------------------------------

const heroBlock = fields.object({
  label: 'Hero Block',
  fields: {
    _template: fields.text({ label: 'Template', defaultValue: 'hero' }),
    ...heroFields,
  },
});

const featuresBlock = fields.object({
  label: 'Features Block',
  fields: {
    _template: fields.text({ label: 'Template', defaultValue: 'features' }),
    heading: fields.text({ label: 'Section Heading' }),
    subheading: fields.text({ label: 'Section Subheading' }),
    items: fields.array(featureItem, { label: 'Feature Items', itemLabel: (props) => props.fields.title.value || 'Feature' }),
  },
});

const statsBlock = fields.object({
  label: 'Stats Block',
  fields: {
    _template: fields.text({ label: 'Template', defaultValue: 'stats' }),
    heading: fields.text({ label: 'Section Heading' }),
    items: fields.array(statItem, { label: 'Stat Items', itemLabel: (props) => props.fields.value.value || 'Stat' }),
  },
});

const testimonialsBlock = fields.object({
  label: 'Testimonials Block',
  fields: {
    _template: fields.text({ label: 'Template', defaultValue: 'testimonials' }),
    heading: fields.text({ label: 'Section Heading' }),
    items: fields.array(testimonialItem, { label: 'Testimonials', itemLabel: (props) => props.fields.author.value || 'Testimonial' }),
  },
});

const ctaBlock = fields.object({
  label: 'Call to Action Block',
  fields: {
    _template: fields.text({ label: 'Template', defaultValue: 'cta' }),
    heading: fields.text({ label: 'Heading' }),
    text: fields.text({ label: 'Body Text', multiline: true }),
    buttonText: fields.text({ label: 'Button Text' }),
    buttonLink: fields.text({ label: 'Button Link' }),
  },
});

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export default config({
  ui: {
    brand: { name: 'Tolemi' },
  },

  storage:
    process.env.NODE_ENV === 'development'
      ? { kind: 'local' }
      : {
          kind: 'github',
          repo: {
            owner: process.env.GITHUB_REPO_OWNER!,
            name: process.env.GITHUB_REPO_NAME!,
          },
        },

  // -------------------------------------------------------------------------
  // Singletons — single JSON files edited as one form
  // -------------------------------------------------------------------------
  singletons: {
    global: singleton({
      label: 'Global Settings',
      path: 'content/global/site',
      format: { data: 'json' },
      schema: {
        companyName: fields.text({ label: 'Company Name' }),
        nav: fields.array(
          fields.object({
            label: 'Nav Link',
            fields: {
              label: fields.text({ label: 'Label', validation: { isRequired: true } }),
              href: fields.text({ label: 'URL', validation: { isRequired: true } }),
              children: fields.array(navChild, {
                label: 'Dropdown Children',
                itemLabel: (props) => props.fields.label.value || 'Link',
              }),
            },
          }),
          { label: 'Navigation Links', itemLabel: (props) => props.fields.label.value || 'Link' }
        ),
        footerText: fields.text({ label: 'Footer Text' }),
        socialLinks: fields.array(
          fields.object({
            label: 'Social Link',
            fields: {
              platform: fields.text({ label: 'Platform', validation: { isRequired: true } }),
              url: fields.text({ label: 'URL', validation: { isRequired: true } }),
            },
          }),
          { label: 'Social Links', itemLabel: (props) => props.fields.platform.value || 'Platform' }
        ),
      },
    }),

    homePage: singleton({
      label: 'Home Page',
      path: 'content/pages/home',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Page Title', validation: { isRequired: true } }),
        blocks: fields.array(
          fields.conditional(
            fields.select({
              label: 'Block type',
              options: [
                { label: 'Hero', value: 'hero' },
                { label: 'Features', value: 'features' },
                { label: 'Stats', value: 'stats' },
                { label: 'Testimonials', value: 'testimonials' },
                { label: 'Call to Action', value: 'cta' },
              ],
              defaultValue: 'hero',
            }),
            {
              hero: fields.object({ label: 'Hero', fields: heroFields }),
              features: fields.object({
                label: 'Features',
                fields: {
                  heading: fields.text({ label: 'Section Heading' }),
                  subheading: fields.text({ label: 'Section Subheading' }),
                  items: fields.array(featureItem, { label: 'Feature Items', itemLabel: (props) => props.fields.title.value || 'Feature' }),
                },
              }),
              stats: fields.object({
                label: 'Stats',
                fields: {
                  heading: fields.text({ label: 'Section Heading' }),
                  items: fields.array(statItem, { label: 'Stat Items', itemLabel: (props) => props.fields.value.value || 'Stat' }),
                },
              }),
              testimonials: fields.object({
                label: 'Testimonials',
                fields: {
                  heading: fields.text({ label: 'Section Heading' }),
                  items: fields.array(testimonialItem, { label: 'Testimonials', itemLabel: (props) => props.fields.author.value || 'Testimonial' }),
                },
              }),
              cta: fields.object({
                label: 'Call to Action',
                fields: {
                  heading: fields.text({ label: 'Heading' }),
                  text: fields.text({ label: 'Body Text', multiline: true }),
                  buttonText: fields.text({ label: 'Button Text' }),
                  buttonLink: fields.text({ label: 'Button Link' }),
                },
              }),
            }
          ),
          { label: 'Page Blocks', itemLabel: (props) => props.discriminant }
        ),
      },
    }),

    aboutPage: singleton({
      label: 'About Page',
      path: 'content/about/about',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Page Title', validation: { isRequired: true } }),
        headline: fields.text({ label: 'Headline' }),
        subheadline: fields.text({ label: 'Subheadline' }),
        historyHeading: fields.text({ label: 'History Heading' }),
        historyBody: fields.text({ label: 'History Body', multiline: true }),
        milestones: fields.array(
          fields.object({
            label: 'Milestone',
            fields: {
              year: fields.text({ label: 'Year', validation: { isRequired: true } }),
              event: fields.text({ label: 'Event', validation: { isRequired: true } }),
            },
          }),
          { label: 'Milestones', itemLabel: (props) => props.fields.year.value || 'Milestone' }
        ),
      },
    }),

    teamPage: singleton({
      label: 'Team Page',
      path: 'content/team/team',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Page Title', validation: { isRequired: true } }),
        headline: fields.text({ label: 'Headline' }),
        subheadline: fields.text({ label: 'Subheadline' }),
        members: fields.array(
          fields.object({
            label: 'Team Member',
            fields: {
              name: fields.text({ label: 'Name', validation: { isRequired: true } }),
              title: fields.text({ label: 'Title' }),
              bio: fields.text({ label: 'Bio', multiline: true }),
              photo: fields.image({
                label: 'Photo',
                directory: 'public/uploads',
                publicPath: '/uploads/',
              }),
            },
          }),
          { label: 'Team Members', itemLabel: (props) => props.fields.name.value || 'Member' }
        ),
      },
    }),

    careersPage: singleton({
      label: 'Careers Page',
      path: 'content/careers/careers',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Page Title', validation: { isRequired: true } }),
        headline: fields.text({ label: 'Headline' }),
        subheadline: fields.text({ label: 'Subheadline' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        cultureHeading: fields.text({ label: 'Culture Heading' }),
        cultureBody: fields.text({ label: 'Culture Body', multiline: true }),
        perks: fields.array(
          fields.object({
            label: 'Perk',
            fields: {
              title: fields.text({ label: 'Title', validation: { isRequired: true } }),
              description: fields.text({ label: 'Description', multiline: true }),
            },
          }),
          { label: 'Perks', itemLabel: (props) => props.fields.title.value || 'Perk' }
        ),
        featuredPosts: fields.array(
          fields.object({
            label: 'Featured Post',
            fields: {
              title: fields.text({ label: 'Title', validation: { isRequired: true } }),
              href: fields.text({ label: 'URL', validation: { isRequired: true } }),
            },
          }),
          { label: 'Featured Blog Posts', itemLabel: (props) => props.fields.title.value || 'Post' }
        ),
        jobs: fields.array(
          fields.object({
            label: 'Job Posting',
            fields: {
              title: fields.text({ label: 'Job Title', validation: { isRequired: true } }),
              department: fields.text({ label: 'Department' }),
              location: fields.text({ label: 'Location' }),
              type: fields.text({ label: 'Type (e.g. Full-time)' }),
              description: fields.text({ label: 'Description', multiline: true }),
              applyLink: fields.text({ label: 'Apply Link' }),
            },
          }),
          { label: 'Job Postings', itemLabel: (props) => props.fields.title.value || 'Job' }
        ),
      },
    }),

    mapExplorer: singleton({
      label: 'Map Explorer',
      path: 'content/map-explorer/map-explorer',
      format: { data: 'json' },
      schema: {
        heading: fields.text({ label: 'Heading' }),
        subheading: fields.text({ label: 'Subheading' }),
        cards: fields.array(
          fields.object({
            label: 'Property Card',
            fields: {
              label: fields.text({ label: 'Label', validation: { isRequired: true } }),
              detail: fields.text({ label: 'Detail Text', validation: { isRequired: true } }),
              color: fields.select({
                label: 'Color',
                options: [
                  { label: 'Green', value: 'green' },
                  { label: 'Blue', value: 'sky' },
                  { label: 'Red', value: 'red' },
                  { label: 'Yellow', value: 'yellow' },
                ],
                defaultValue: 'green',
              }),
            },
          }),
          { label: 'Property Cards', itemLabel: (props) => props.fields.label.value || 'Card' }
        ),
      },
    }),
  },

  // -------------------------------------------------------------------------
  // Collections — one JSON file per entry (products, solutions)
  // -------------------------------------------------------------------------
  collections: {
    products: collection({
      label: 'Products',
      path: 'content/products/*',
      format: { data: 'json' },
      slugField: 'slug',
      schema: {
        title: fields.text({ label: 'Page Title', validation: { isRequired: true } }),
        slug: fields.text({ label: 'Slug', validation: { isRequired: true } }),
        headline: fields.text({ label: 'Headline' }),
        subheadline: fields.text({ label: 'Subheadline' }),
        body: fields.text({ label: 'Body', multiline: true }),
        features: fields.array(
          fields.object({
            label: 'Feature',
            fields: {
              title: fields.text({ label: 'Title', validation: { isRequired: true } }),
              description: fields.text({ label: 'Description', multiline: true }),
            },
          }),
          { label: 'Features', itemLabel: (props) => props.fields.title.value || 'Feature' }
        ),
      },
    }),

    solutions: collection({
      label: 'Solutions',
      path: 'content/solutions/*',
      format: { data: 'json' },
      slugField: 'slug',
      schema: {
        title: fields.text({ label: 'Page Title', validation: { isRequired: true } }),
        slug: fields.text({ label: 'Slug', validation: { isRequired: true } }),
        headline: fields.text({ label: 'Headline' }),
        subheadline: fields.text({ label: 'Subheadline' }),
        body: fields.text({ label: 'Body', multiline: true }),
        features: fields.array(
          fields.object({
            label: 'Feature',
            fields: {
              title: fields.text({ label: 'Title', validation: { isRequired: true } }),
              description: fields.text({ label: 'Description', multiline: true }),
            },
          }),
          { label: 'Features', itemLabel: (props) => props.fields.title.value || 'Feature' }
        ),
      },
    }),
  },
});
