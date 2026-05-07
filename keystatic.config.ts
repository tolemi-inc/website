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

const featureItem = fields.object(
  {
    title: fields.text({ label: 'Title', validation: { isRequired: true } }),
    description: fields.text({ label: 'Description', multiline: true }),
    icon: fields.text({ label: 'Icon (emoji or text)' }),
  },
  { label: 'Feature Item' }
);

const statItem = fields.object(
  {
    value: fields.text({ label: 'Value', validation: { isRequired: true } }),
    label: fields.text({ label: 'Label', validation: { isRequired: true } }),
  },
  { label: 'Stat Item' }
);

const navChild = fields.object(
  {
    label: fields.text({ label: 'Label', validation: { isRequired: true } }),
    href: fields.text({ label: 'URL', validation: { isRequired: true } }),
  },
  { label: 'Nav Child Link' }
);

const featureBlock = fields.object(
  {
    title: fields.text({ label: 'Title', validation: { isRequired: true } }),
    body: fields.markdoc.inline({
      label: 'Body',
      options: {
        bold: true,
        italic: true,
        strikethrough: true,
        link: true,
        orderedList: true,
        unorderedList: true,
        blockquote: true,
        code: true,
      },
    }),
    images: fields.array(
      fields.image({
        label: 'Image',
        directory: 'public/uploads/features',
        publicPath: '/uploads/features/',
      }),
      { label: 'Images', itemLabel: (props) => props.value?.filename || 'Image' }
    ),
  },
  { label: 'Feature' }
);

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
            owner: 'tolemi-inc',
            name: 'website',
          },
          branchPrefix: 'keystatic-',
        },

  // -------------------------------------------------------------------------
  // Singletons — single JSON files edited as one form
  // -------------------------------------------------------------------------
  singletons: {
    global: singleton({
      label: 'Global Settings',
      path: 'content/global/site',
      previewUrl: 'https://{branch}--tolemi.netlify.app/',
      format: { data: 'json' },
      schema: {
        companyName: fields.text({ label: 'Company Name' }),
        demoBookingUrl: fields.url({
          label: 'Demo Booking URL',
          description: 'Google appointment-schedule link. All "Get a Demo" CTAs open this in a new tab.',
          validation: { isRequired: true },
        }),
        nav: fields.array(
          fields.object(
            {
              label: fields.text({ label: 'Label', validation: { isRequired: true } }),
              href: fields.text({ label: 'URL', validation: { isRequired: true } }),
              children: fields.array(navChild, {
                label: 'Dropdown Children',
                itemLabel: (props) => props.fields.label.value || 'Link',
              }),
            },
            { label: 'Nav Link' }
          ),
          { label: 'Navigation Links', itemLabel: (props) => props.fields.label.value || 'Link' }
        ),
        footerText: fields.text({ label: 'Footer Text' }),
        footerLinks: fields.object(
          {
            solutions: fields.array(
              fields.object(
                {
                  label: fields.text({ label: 'Label', validation: { isRequired: true } }),
                  href: fields.text({ label: 'URL', validation: { isRequired: true } }),
                },
                { label: 'Link' }
              ),
              { label: 'Solutions Links', itemLabel: (props) => props.fields.label.value || 'Link' }
            ),
            products: fields.array(
              fields.object(
                {
                  label: fields.text({ label: 'Label', validation: { isRequired: true } }),
                  href: fields.text({ label: 'URL', validation: { isRequired: true } }),
                },
                { label: 'Link' }
              ),
              { label: 'Products Links', itemLabel: (props) => props.fields.label.value || 'Link' }
            ),
            company: fields.array(
              fields.object(
                {
                  label: fields.text({ label: 'Label', validation: { isRequired: true } }),
                  href: fields.text({ label: 'URL', validation: { isRequired: true } }),
                },
                { label: 'Link' }
              ),
              { label: 'Company Links', itemLabel: (props) => props.fields.label.value || 'Link' }
            ),
            legal: fields.array(
              fields.object(
                {
                  label: fields.text({ label: 'Label', validation: { isRequired: true } }),
                  href: fields.text({ label: 'URL', validation: { isRequired: true } }),
                },
                { label: 'Link' }
              ),
              { label: 'Legal Links', itemLabel: (props) => props.fields.label.value || 'Link' }
            ),
          },
          { label: 'Footer Links' }
        ),
        socialLinks: fields.array(
          fields.object(
            {
              platform: fields.text({ label: 'Platform', validation: { isRequired: true } }),
              url: fields.text({ label: 'URL', validation: { isRequired: true } }),
            },
            { label: 'Social Link' }
          ),
          { label: 'Social Links', itemLabel: (props) => props.fields.platform.value || 'Platform' }
        ),
      },
    }),

    homePage: singleton({
      label: 'Home Page',
      path: 'content/pages/home',
      previewUrl: 'https://{branch}--tolemi.netlify.app/',
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
                { label: 'Call to Action', value: 'cta' },
              ],
              defaultValue: 'hero',
            }),
            {
              hero: fields.object(heroFields, { label: 'Hero' }),
              features: fields.object(
                {
                  heading: fields.text({ label: 'Section Heading' }),
                  subheading: fields.text({ label: 'Section Subheading' }),
                  items: fields.array(featureItem, {
                    label: 'Feature Items',
                    itemLabel: (props) => props.fields.title.value || 'Feature',
                  }),
                },
                { label: 'Features' }
              ),
              stats: fields.object(
                {
                  heading: fields.text({ label: 'Section Heading' }),
                  items: fields.array(statItem, {
                    label: 'Stat Items',
                    itemLabel: (props) => props.fields.value.value || 'Stat',
                  }),
                },
                { label: 'Stats' }
              ),
              cta: fields.object(
                {
                  heading: fields.text({ label: 'Heading' }),
                  text: fields.text({ label: 'Body Text', multiline: true }),
                  buttonText: fields.text({ label: 'Button Text' }),
                  buttonLink: fields.text({ label: 'Button Link' }),
                },
                { label: 'Call to Action' }
              ),
            }
          ),
          { label: 'Page Blocks', itemLabel: (props) => props.discriminant }
        ),
      },
    }),

    aboutPage: singleton({
      label: 'About Page',
      path: 'content/about/about',
      previewUrl: 'https://{branch}--tolemi.netlify.app/about',
      format: { contentField: 'historyBody' },
      schema: {
        title: fields.text({ label: 'Page Title', validation: { isRequired: true } }),
        headline: fields.text({ label: 'Headline' }),
        subheadline: fields.text({ label: 'Subheadline' }),
        historyHeading: fields.text({ label: 'History Heading' }),
        historyBody: fields.markdoc({ label: 'History Body' }),
        milestones: fields.array(
          fields.object(
            {
              year: fields.text({ label: 'Year', validation: { isRequired: true } }),
              event: fields.text({ label: 'Event', validation: { isRequired: true } }),
            },
            { label: 'Milestone' }
          ),
          { label: 'Milestones', itemLabel: (props) => props.fields.year.value || 'Milestone' }
        ),
      },
    }),

    teamPage: singleton({
      label: 'Team Page',
      path: 'content/team/team',
      previewUrl: 'https://{branch}--tolemi.netlify.app/team',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Page Title', validation: { isRequired: true } }),
        headline: fields.text({ label: 'Headline' }),
        subheadline: fields.text({ label: 'Subheadline' }),
        members: fields.array(
          fields.object(
            {
              name: fields.text({ label: 'Name', validation: { isRequired: true } }),
              title: fields.text({ label: 'Title' }),
              bio: fields.text({ label: 'Bio', multiline: true }),
              photo: fields.image({
                label: 'Photo',
                directory: 'public/uploads',
                publicPath: '/uploads/',
              }),
            },
            { label: 'Team Member' }
          ),
          { label: 'Team Members', itemLabel: (props) => props.fields.name.value || 'Member' }
        ),
      },
    }),

    careersPage: singleton({
      label: 'Careers Page',
      path: 'content/careers/careers',
      previewUrl: 'https://{branch}--tolemi.netlify.app/careers',
      format: { contentField: 'intro' },
      schema: {
        title: fields.text({ label: 'Page Title', validation: { isRequired: true } }),
        headline: fields.text({ label: 'Headline' }),
        subheadline: fields.text({ label: 'Subheadline' }),
        intro: fields.markdoc({ label: 'Intro' }),
        cultureHeading: fields.text({ label: 'Culture Heading' }),
        cultureBody: fields.text({ label: 'Culture Body', multiline: true }),
        perks: fields.array(
          fields.object(
            {
              title: fields.text({ label: 'Title', validation: { isRequired: true } }),
              description: fields.text({ label: 'Description', multiline: true }),
            },
            { label: 'Perk' }
          ),
          { label: 'Perks', itemLabel: (props) => props.fields.title.value || 'Perk' }
        ),
        featuredPosts: fields.array(
          fields.object(
            {
              title: fields.text({ label: 'Title', validation: { isRequired: true } }),
              href: fields.text({ label: 'URL', validation: { isRequired: true } }),
            },
            { label: 'Featured Post' }
          ),
          { label: 'Featured Blog Posts', itemLabel: (props) => props.fields.title.value || 'Post' }
        ),
        jobs: fields.array(
          fields.object(
            {
              title: fields.text({ label: 'Job Title', validation: { isRequired: true } }),
              department: fields.text({ label: 'Department' }),
              location: fields.text({ label: 'Location' }),
              type: fields.text({ label: 'Type (e.g. Full-time)' }),
              description: fields.text({ label: 'Description', multiline: true }),
              applyLink: fields.text({ label: 'Apply Link' }),
            },
            { label: 'Job Posting' }
          ),
          { label: 'Job Postings', itemLabel: (props) => props.fields.title.value || 'Job' }
        ),
      },
    }),

    privacyPolicy: singleton({
      label: 'Privacy Policy',
      path: 'content/about/privacy-policy',
      previewUrl: 'https://{branch}--tolemi.netlify.app/about/privacypolicy',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Page Title', validation: { isRequired: true } }),
        headline: fields.text({ label: 'Headline' }),
        lastUpdated: fields.date({ label: 'Last Updated' }),
        body: fields.markdoc({ label: 'Body' }),
      },
    }),

    termsOfService: singleton({
      label: 'Terms of Service',
      path: 'content/about/terms-of-service',
      previewUrl: 'https://{branch}--tolemi.netlify.app/about/termsofservice',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Page Title', validation: { isRequired: true } }),
        headline: fields.text({ label: 'Headline' }),
        lastUpdated: fields.date({ label: 'Last Updated' }),
        body: fields.markdoc({ label: 'Body' }),
      },
    }),

    mapExplorer: singleton({
      label: 'Map Explorer',
      path: 'content/map-explorer/map-explorer',
      previewUrl: 'https://{branch}--tolemi.netlify.app/',
      format: { data: 'json' },
      schema: {
        heading: fields.text({ label: 'Heading' }),
        subheading: fields.text({ label: 'Subheading' }),
        cards: fields.array(
          fields.object(
            {
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
            { label: 'Property Card' }
          ),
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
      path: 'content/products/*/',
      previewUrl: 'https://{branch}--tolemi.netlify.app/products/{slug}',
      format: { contentField: 'body' },
      slugField: 'title',
      schema: {
        title: fields.slug({ name: { label: 'Page Title' } }),
        headline: fields.text({ label: 'Headline' }),
        subheadline: fields.text({ label: 'Subheadline' }),
        image: fields.image({
          label: 'Image',
          directory: 'public/uploads/products',
          publicPath: '/uploads/products/',
        }),
        body: fields.markdoc({ label: 'Body' }),
        features: fields.array(featureBlock, {
          label: 'Features',
          itemLabel: (props) => props.fields.title.value || 'Feature',
        }),
      },
    }),

    solutions: collection({
      label: 'Solutions',
      path: 'content/solutions/*/',
      previewUrl: 'https://{branch}--tolemi.netlify.app/solutions/{slug}',
      format: { contentField: 'body' },
      slugField: 'title',
      schema: {
        title: fields.slug({ name: { label: 'Page Title' } }),
        headline: fields.text({ label: 'Headline' }),
        subheadline: fields.text({ label: 'Subheadline' }),
        image: fields.image({
          label: 'Image',
          directory: 'public/uploads/solutions',
          publicPath: '/uploads/solutions/',
        }),
        body: fields.markdoc({ label: 'Body' }),
        features: fields.array(featureBlock, {
          label: 'Features',
          itemLabel: (props) => props.fields.title.value || 'Feature',
        }),
      },
    }),

    spotlightPosts: collection({
      label: 'Blog — Spotlight',
      path: 'content/blog/spotlight/*/',
      format: { contentField: 'body' },
      slugField: 'title',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        image: fields.image({
          label: 'Cover Image',
          directory: 'public/uploads/blog',
          publicPath: '/uploads/blog/',
        }),
        publishedDate: fields.date({ label: 'Published Date' }),
        useCases: fields.array(
          fields.relationship({ label: 'Use Case', collection: 'solutions' }),
          {
            label: 'Use Cases',
            description: 'Tag this post with the use cases it relates to. These are the only tags shown on the spotlight page and drive filtering.',
            itemLabel: (props) => props.value || 'Use Case',
          }
        ),
        body: fields.markdoc({ label: 'Body' }),
      },
    }),

    caseStudies: collection({
      label: 'Blog — Case Studies',
      path: 'content/blog/case-studies/*/',
      format: { contentField: 'body' },
      slugField: 'title',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        subtitle: fields.text({ label: 'Subtitle (e.g. City, State)' }),
        description: fields.text({ label: 'Description', multiline: true }),
        image: fields.image({
          label: 'Cover Image',
          directory: 'public/uploads/blog',
          publicPath: '/uploads/blog/',
        }),
        client: fields.text({ label: 'Client / Organization' }),
        publishedDate: fields.date({ label: 'Published Date' }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value || 'Tag',
        }),
        relatedSolutions: fields.array(
          fields.relationship({ label: 'Solution', collection: 'solutions' }),
          { label: 'Related Solutions', itemLabel: (props) => props.value || 'Solution' }
        ),
        relatedProducts: fields.array(
          fields.relationship({ label: 'Product', collection: 'products' }),
          { label: 'Related Products', itemLabel: (props) => props.value || 'Product' }
        ),
        body: fields.markdoc({
          label: 'Body',
          options: {
            image: {
              directory: 'public/uploads/blog',
              publicPath: '/uploads/blog/',
            },
          },
        }),
      },
    }),
  },
});
