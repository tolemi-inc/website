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

// Image with required alt text. Use `imageWithAlt({ directory, publicPath })`
// anywhere you'd previously have used `fields.image()` directly.
const imageWithAlt = (opts: { label?: string; directory: string; publicPath: string }) =>
  fields.object(
    {
      src: fields.image({
        label: 'Image',
        directory: opts.directory,
        publicPath: opts.publicPath,
      }),
      alt: fields.text({
        label: 'Alt text',
        description:
          'Describe the image for screen readers and SEO. Leave blank only if the image is purely decorative.',
      }),
    },
    { label: opts.label || 'Image' }
  );

const titledItem = fields.object(
  {
    title: fields.text({ label: 'Title', validation: { isRequired: true } }),
    description: fields.text({ label: 'Description', multiline: true }),
  },
  { label: 'Item' }
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
      imageWithAlt({
        directory: 'public/uploads/features',
        publicPath: '/uploads/features/',
      }),
      { label: 'Images', itemLabel: (props) => props.fields.src.value?.filename || 'Image' }
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
                { label: 'Hero (Mission)', value: 'hero' },
                { label: 'Story Graph (Data → Action)', value: 'story' },
                { label: 'Products', value: 'products' },
                { label: 'Registration Spotlight', value: 'registration' },
                { label: 'How We Work', value: 'howWeWork' },
                { label: 'Why Us', value: 'whyUs' },
                { label: 'City Logos', value: 'logos' },
                { label: 'Stats', value: 'stats' },
                { label: 'Call to Action', value: 'cta' },
              ],
              defaultValue: 'hero',
            }),
            {
              hero: fields.object(heroFields, { label: 'Hero' }),
              story: fields.object(
                {
                  heading: fields.text({ label: 'Section Heading' }),
                  subheading: fields.text({ label: 'Section Subheading', multiline: true }),
                  stages: fields.array(
                    fields.object(
                      {
                        label: fields.text({ label: 'Stage Label', validation: { isRequired: true } }),
                        detail: fields.text({ label: 'Stage Detail', multiline: true }),
                      },
                      { label: 'Stage' }
                    ),
                    {
                      label: 'Pipeline Stages (expects 4: data → insights → workflows → action)',
                      itemLabel: (props) => props.fields.label.value || 'Stage',
                    }
                  ),
                  layers: fields.array(
                    fields.object(
                      {
                        name: fields.text({ label: 'Product Name', validation: { isRequired: true } }),
                        role: fields.text({ label: 'Role (short label)' }),
                        detail: fields.text({ label: 'Detail', multiline: true }),
                      },
                      { label: 'Layer' }
                    ),
                    {
                      label:
                        'Product Layers (expects 3: first spans stages 1–2, second spans 3–4, third spans full width)',
                      itemLabel: (props) => props.fields.name.value || 'Layer',
                    }
                  ),
                },
                { label: 'Story Graph' }
              ),
              products: fields.object(
                {
                  heading: fields.text({ label: 'Section Heading' }),
                  subheading: fields.text({ label: 'Section Subheading', multiline: true }),
                  items: fields.array(
                    fields.object(
                      {
                        name: fields.text({ label: 'Product Name', validation: { isRequired: true } }),
                        tagline: fields.text({ label: 'Tagline (shown above name)' }),
                        description: fields.text({ label: 'Description', multiline: true }),
                        bullets: fields.array(fields.text({ label: 'Bullet' }), {
                          label: 'Bullets',
                          itemLabel: (props) => props.value || 'Bullet',
                        }),
                        imagePath: fields.text({
                          label: 'Screenshot Path',
                          description:
                            'Path under /public, e.g. /screenshots/bbmap.png. Leave blank to show a stylized workflow card instead of a screenshot.',
                        }),
                        imageAlt: fields.text({ label: 'Screenshot Alt Text' }),
                      },
                      { label: 'Product' }
                    ),
                    { label: 'Products', itemLabel: (props) => props.fields.name.value || 'Product' }
                  ),
                },
                { label: 'Products' }
              ),
              registration: fields.object(
                {
                  eyebrow: fields.text({ label: 'Eyebrow' }),
                  heading: fields.text({ label: 'Heading' }),
                  body: fields.text({ label: 'Body', multiline: true }),
                  bullets: fields.array(titledItem, {
                    label: 'Teaser Bullets',
                    itemLabel: (props) => props.fields.title.value || 'Bullet',
                  }),
                  imagePath: fields.text({
                    label: 'Image Path',
                    description: 'Path under /public, e.g. /screenshots/owner-timeline.png',
                  }),
                  imageAlt: fields.text({ label: 'Image Alt Text' }),
                  ctaText: fields.text({ label: 'CTA Button Text' }),
                  ctaLink: fields.text({ label: 'CTA Button Link' }),
                },
                { label: 'Registration Spotlight' }
              ),
              howWeWork: fields.object(
                {
                  heading: fields.text({ label: 'Section Heading' }),
                  subheading: fields.text({ label: 'Section Subheading', multiline: true }),
                  steps: fields.array(titledItem, {
                    label: 'Steps',
                    itemLabel: (props) => props.fields.title.value || 'Step',
                  }),
                  closing: fields.text({ label: 'Closing Line' }),
                },
                { label: 'How We Work' }
              ),
              whyUs: fields.object(
                {
                  heading: fields.text({ label: 'Section Heading' }),
                  body: fields.text({ label: 'Body', multiline: true }),
                  points: fields.array(titledItem, {
                    label: 'Points',
                    itemLabel: (props) => props.fields.title.value || 'Point',
                  }),
                },
                { label: 'Why Us' }
              ),
              logos: fields.object(
                {
                  heading: fields.text({ label: 'Section Heading' }),
                  subheading: fields.text({ label: 'Section Subheading', multiline: true }),
                },
                { label: 'City Logos' }
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
        historyBody: fields.markdoc({
          label: 'History Body',
          options: {
            image: {
              directory: 'public/uploads/about',
              publicPath: '/uploads/about/',
            },
          },
        }),
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
              photo: imageWithAlt({
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
        intro: fields.markdoc({
          label: 'Intro',
          options: {
            image: {
              directory: 'public/uploads/careers',
              publicPath: '/uploads/careers/',
            },
          },
        }),
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
        image: imageWithAlt({
          label: 'Header Image',
          directory: 'public/uploads/products',
          publicPath: '/uploads/products/',
        }),
        body: fields.markdoc({
          label: 'Body',
          options: {
            image: {
              directory: 'public/uploads/products',
              publicPath: '/uploads/products/',
            },
          },
        }),
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
        image: imageWithAlt({
          label: 'Header Image',
          directory: 'public/uploads/solutions',
          publicPath: '/uploads/solutions/',
        }),
        body: fields.markdoc({
          label: 'Body',
          options: {
            image: {
              directory: 'public/uploads/solutions',
              publicPath: '/uploads/solutions/',
            },
          },
        }),
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
        image: imageWithAlt({
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

    caseStudies: collection({
      label: 'Blog — Case Studies',
      path: 'content/blog/case-studies/*/',
      format: { contentField: 'body' },
      slugField: 'title',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        subtitle: fields.text({ label: 'Subtitle (e.g. City, State)' }),
        description: fields.text({ label: 'Description', multiline: true }),
        image: imageWithAlt({
          label: 'Cover Image',
          directory: 'public/uploads/blog',
          publicPath: '/uploads/blog/',
        }),
        client: fields.text({ label: 'Client / Organization' }),
        publishedDate: fields.date({ label: 'Published Date' }),
        relatedSolutions: fields.array(
          fields.relationship({ label: 'Use Case', collection: 'solutions' }),
          {
            label: 'Use Cases',
            description: 'Tag this case study with the use cases it relates to. These are the only tags shown on case study cards and drive filtering.',
            itemLabel: (props) => props.value || 'Use Case',
          }
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
