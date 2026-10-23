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

// Icon names must match src/components/ui/Icon.astro.
const iconOptions = [
  { label: 'None', value: '' },
  { label: 'workflow', value: 'workflow' },
  { label: 'sliders', value: 'sliders' },
  { label: 'bar-chart', value: 'bar-chart' },
  { label: 'trending-up', value: 'trending-up' },
  { label: 'map-pin', value: 'map-pin' },
  { label: 'clipboard-check', value: 'clipboard-check' },
  { label: 'home', value: 'home' },
  { label: 'key', value: 'key' },
  { label: 'building', value: 'building' },
  { label: 'file-text', value: 'file-text' },
  { label: 'database', value: 'database' },
  { label: 'search', value: 'search' },
  { label: 'users', value: 'users' },
  { label: 'share', value: 'share' },
  { label: 'bell', value: 'bell' },
  { label: 'layers', value: 'layers' },
  { label: 'tag', value: 'tag' },
  { label: 'presentation', value: 'presentation' },
  { label: 'filter', value: 'filter' },
  { label: 'message', value: 'message' },
  { label: 'globe', value: 'globe' },
  { label: 'eye', value: 'eye' },
  { label: 'user-check', value: 'user-check' },
  { label: 'shield', value: 'shield' },
  { label: 'network', value: 'network' },
  { label: 'briefcase', value: 'briefcase' },
  { label: 'heart', value: 'heart' },
  { label: 'alert', value: 'alert' },
  { label: 'calendar', value: 'calendar' },
  { label: 'landmark', value: 'landmark' },
  { label: 'lightbulb', value: 'lightbulb' },
  { label: 'zap', value: 'zap' },
  { label: 'link', value: 'link' },
  { label: 'rocket', value: 'rocket' },
  { label: 'graduation', value: 'graduation' },
  { label: 'life-buoy', value: 'life-buoy' },
  { label: 'target', value: 'target' },
  { label: 'sun', value: 'sun' },
  { label: 'sprout', value: 'sprout' },
  { label: 'flower', value: 'flower' },
  { label: 'laptop', value: 'laptop' },
  { label: 'monitor', value: 'monitor' },
  { label: 'piggy-bank', value: 'piggy-bank' },
];

const iconedItem = fields.object(
  {
    title: fields.text({ label: 'Title', validation: { isRequired: true } }),
    description: fields.text({ label: 'Description', multiline: true }),
    icon: fields.select({ label: 'Icon', options: iconOptions, defaultValue: '' }),
  },
  { label: 'Item' }
);

// An accordion item whose photo shows beside the accordion while it's open
// (careers Working at Tolemi section).
const accordionItem = fields.object(
  {
    title: fields.text({ label: 'Title', validation: { isRequired: true } }),
    description: fields.text({ label: 'Description', multiline: true }),
    icon: fields.select({ label: 'Icon', options: iconOptions, defaultValue: '' }),
    photo: imageWithAlt({
      label: 'Photo (shown while this item is open)',
      directory: 'public/uploads/careers',
      publicPath: '/uploads/careers/',
    }),
    photoCaption: fields.text({ label: 'Photo Caption (optional)' }),
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
        siteDescription: fields.text({
          label: 'Site Description',
          description:
            'Default summary shown in search results and link previews (Slack, LinkedIn, etc.). Aim for 110–160 characters.',
          multiline: true,
        }),
        shareImage: fields.image({
          label: 'Default Share Image',
          description: 'Image shown in link previews when a page has no image of its own. Use 1200×630.',
          directory: 'public/uploads/og',
          publicPath: '/uploads/og/',
        }),
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
                        detail: fields.text({
                          label: 'Stage Detail',
                          description: 'Wrap keywords in **double asterisks** to bold them in the stage color.',
                          multiline: true,
                        }),
                        icon: fields.select({ label: 'Icon', options: iconOptions, defaultValue: '' }),
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
                  ctaNote: fields.text({
                    label: 'CTA note (small line under each product demo button)',
                  }),
                  items: fields.array(
                    fields.object(
                      {
                        name: fields.text({ label: 'Product Name', validation: { isRequired: true } }),
                        tagline: fields.text({
                          label: 'Category (eyebrow, e.g. "Property Data & Spatial Analytics — Integration · Analysis · Automation")',
                        }),
                        headline: fields.text({ label: 'Headline (first beat, e.g. "Your data is already there,")' }),
                        headlineAccent: fields.text({
                          label: 'Headline accent (second beat, e.g. "BuildingBlocks connects it.")',
                        }),
                        description: fields.text({ label: 'Intro paragraph', multiline: true }),
                        featuresHeading: fields.text({
                          label: 'Features heading',
                          defaultValue: 'Key Features',
                        }),
                        features: fields.array(iconedItem, {
                          label: 'Key Features',
                          itemLabel: (props) => props.fields.title.value || 'Feature',
                        }),
                        useCasesHeading: fields.text({
                          label: 'Use Cases heading (e.g. "How governments are using Slate")',
                        }),
                        useCases: fields.array(iconedItem, {
                          label: 'Use Cases ("what cities are using it for")',
                          itemLabel: (props) => props.fields.title.value || 'Use case',
                        }),
                        imagePath: fields.text({
                          label: 'Screenshot Path',
                          description:
                            'Path under /public, e.g. /screenshots/bbmap.png. Leave blank to show a stylized workflow card instead of a screenshot.',
                        }),
                        imageAlt: fields.text({ label: 'Screenshot Alt Text' }),
                        ctaText: fields.text({ label: 'CTA text (e.g. "See your city\'s data in one place.")' }),
                        ctaLink: fields.text({ label: 'CTA link' }),
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
              whyUs: fields.object(
                {
                  heading: fields.text({ label: 'Section Heading' }),
                  body: fields.text({ label: 'Body', multiline: true }),
                  points: fields.array(
                    fields.object(
                      {
                        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
                        description: fields.text({ label: 'Description', multiline: true }),
                        icon: fields.select({ label: 'Icon', options: iconOptions, defaultValue: '' }),
                      },
                      { label: 'Point' }
                    ),
                    {
                      label: 'Points',
                      itemLabel: (props) => props.fields.title.value || 'Point',
                    }
                  ),
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
        teamPhoto: fields.object(
          {
            photo: imageWithAlt({
              directory: 'public/uploads/about',
              publicPath: '/uploads/about/',
            }),
            caption: fields.text({ label: 'Caption (optional)' }),
          },
          { label: 'Team Photo (full width, under the headline)' }
        ),
        historyHeading: fields.text({ label: 'History Heading' }),
        historyImage: fields.object(
          {
            photo: imageWithAlt({
              directory: 'public/uploads/about',
              publicPath: '/uploads/about/',
            }),
            caption: fields.text({ label: 'Caption' }),
            credit: fields.text({
              label: 'Image credit',
              description: 'Artist/photographer and license, e.g. "André Thevet, 1584, public domain".',
            }),
          },
          { label: 'History Image (left of the first paragraph)' }
        ),
        historyBody: fields.markdoc({
          label: 'History Body',
          options: {
            image: {
              directory: 'public/uploads/about',
              publicPath: '/uploads/about/',
            },
          },
        }),
        cityPhotos: fields.array(
          fields.object(
            {
              photo: imageWithAlt({
                label: 'Photo',
                directory: 'public/uploads/about',
                publicPath: '/uploads/about/',
              }),
              caption: fields.text({ label: 'Caption' }),
              credit: fields.text({
                label: 'Photo credit',
                description: 'Photographer and license, e.g. "Carol M. Highsmith, public domain".',
              }),
            },
            { label: 'City Photo' }
          ),
          {
            label: 'City Photos',
            description: 'Shown in a row above the last paragraph of the history body.',
            itemLabel: (props) => props.fields.caption.value || 'City Photo',
          }
        ),
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
        howWeWork: fields.object(
          {
            heading: fields.text({ label: 'Section Heading' }),
            subheading: fields.text({ label: 'Section Subheading', multiline: true }),
            steps: fields.array(iconedItem, {
              label: 'Steps',
              itemLabel: (props) => props.fields.title.value || 'Step',
            }),
            closing: fields.text({ label: 'Closing Line' }),
          },
          { label: 'How We Work' }
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
          label: 'Intro (not currently shown on the page)',
          options: {
            image: {
              directory: 'public/uploads/careers',
              publicPath: '/uploads/careers/',
            },
          },
        }),
        teamPhotos: fields.object(
          {
            featurePhoto: fields.object(
              {
                photo: imageWithAlt({
                  directory: 'public/uploads/careers',
                  publicPath: '/uploads/careers/',
                }),
                caption: fields.text({ label: 'Caption (optional)' }),
              },
              { label: 'Feature Photo (full width, above the gallery)' }
            ),
            photos: fields.array(
              fields.object(
                {
                  photo: imageWithAlt({
                    directory: 'public/uploads/careers',
                    publicPath: '/uploads/careers/',
                  }),
                  caption: fields.text({ label: 'Caption (optional)' }),
                  size: fields.select({
                    label: 'Tile Size',
                    options: [
                      { label: 'Standard (1×1)', value: 'standard' },
                      { label: 'Wide (2×1)', value: 'wide' },
                      { label: 'Tall (1×2)', value: 'tall' },
                      { label: 'Large (2×2)', value: 'large' },
                    ],
                    defaultValue: 'standard',
                  }),
                  focus: fields.select({
                    label: 'Crop Focus (which part stays in frame)',
                    options: [
                      { label: 'Center', value: 'center' },
                      { label: 'Top', value: 'top' },
                      { label: 'Bottom', value: 'bottom' },
                    ],
                    defaultValue: 'center',
                  }),
                },
                { label: 'Photo' }
              ),
              {
                label: 'Gallery Photos',
                itemLabel: (props) =>
                  props.fields.caption.value || props.fields.photo.fields.alt.value || 'Photo',
              }
            ),
          },
          { label: 'Team Photos (top of page)' }
        ),
        culture: fields.object(
          {
            heading: fields.text({ label: 'Heading', defaultValue: 'Working at Tolemi' }),
            items: fields.array(accordionItem, {
              label: 'Items (accordion; first item starts open)',
              itemLabel: (props) => props.fields.title.value || 'Item',
            }),
          },
          { label: 'How We Work (accordion)' }
        ),
        internship: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            body: fields.text({ label: 'Body', multiline: true }),
            tracks: fields.array(titledItem, {
              label: 'Positions',
              itemLabel: (props) => props.fields.title.value || 'Position',
            }),
            outcomes: fields.text({ label: 'Outcomes', multiline: true }),
            photo: imageWithAlt({
              label: 'Photo',
              directory: 'public/uploads/careers',
              publicPath: '/uploads/careers/',
            }),
            photoCaption: fields.text({ label: 'Photo Caption (optional)' }),
          },
          { label: 'Internship Program' }
        ),
        perksHeading: fields.text({ label: 'Benefits Heading', defaultValue: 'Benefits & Perks' }),
        perks: fields.array(
          fields.object(
            {
              title: fields.text({ label: 'Title', validation: { isRequired: true } }),
              description: fields.text({ label: 'Description', multiline: true }),
              photo: imageWithAlt({
                label: 'Photo (shown above the heading)',
                directory: 'public/uploads/careers',
                publicPath: '/uploads/careers/',
              }),
              photoCaption: fields.text({ label: 'Photo Caption (optional)' }),
              icon: fields.select({
                label: 'Icon (shown on a navy tile when there is no photo)',
                options: iconOptions,
                defaultValue: '',
              }),
            },
            { label: 'Benefit' }
          ),
          { label: 'Benefits', itemLabel: (props) => props.fields.title.value || 'Benefit' }
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
      previewUrl: 'https://{branch}--tolemi.netlify.app/privacy',
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
      previewUrl: 'https://{branch}--tolemi.netlify.app/terms',
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
