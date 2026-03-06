import { defineConfig } from "tinacms";

const hero = {
  name: "hero",
  label: "Hero",
  fields: [
    { name: "headline", label: "Headline", type: "string", required: true },
    { name: "subheadline", label: "Sub-headline", type: "string" },
    { name: "ctaText", label: "CTA Button Text", type: "string" },
    { name: "ctaLink", label: "CTA Button Link", type: "string" },
  ],
};

const features = {
  name: "features",
  label: "Features",
  fields: [
    { name: "heading", label: "Section Heading", type: "string" },
    { name: "subheading", label: "Section Subheading", type: "string" },
    {
      name: "items",
      label: "Feature Items",
      type: "object",
      list: true,
      fields: [
        { name: "title", label: "Title", type: "string", required: true },
        { name: "description", label: "Description", type: "string" },
        { name: "icon", label: "Icon (emoji or text)", type: "string" },
      ],
    },
  ],
};

const stats = {
  name: "stats",
  label: "Stats",
  fields: [
    { name: "heading", label: "Section Heading", type: "string" },
    {
      name: "items",
      label: "Stat Items",
      type: "object",
      list: true,
      fields: [
        { name: "value", label: "Value", type: "string", required: true },
        { name: "label", label: "Label", type: "string", required: true },
      ],
    },
  ],
};

const testimonials = {
  name: "testimonials",
  label: "Testimonials",
  fields: [
    { name: "heading", label: "Section Heading", type: "string" },
    {
      name: "items",
      label: "Testimonials",
      type: "object",
      list: true,
      fields: [
        { name: "quote", label: "Quote", type: "string", required: true },
        { name: "author", label: "Author Name", type: "string" },
        { name: "role", label: "Author Role", type: "string" },
      ],
    },
  ],
};

const cta = {
  name: "cta",
  label: "Call to Action",
  fields: [
    { name: "heading", label: "Heading", type: "string" },
    { name: "text", label: "Body Text", type: "string" },
    { name: "buttonText", label: "Button Text", type: "string" },
    { name: "buttonLink", label: "Button Link", type: "string" },
  ],
};

export default defineConfig({
  branch: "",
  clientId: "",
  token: "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },
  schema: {
    collections: [
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        format: "json",
        fields: [
          { name: "title", label: "Page Title", type: "string", required: true },
          {
            name: "blocks",
            label: "Page Blocks",
            type: "object",
            list: true,
            templates: [hero, features, stats, testimonials, cta],
          },
        ],
      },
      {
        name: "global",
        label: "Global Settings",
        path: "content/global",
        format: "json",
        ui: {
          global: true,
        },
        fields: [
          { name: "companyName", label: "Company Name", type: "string" },
          {
            name: "nav",
            label: "Navigation Links",
            type: "object",
            list: true,
            fields: [
              { name: "label", label: "Label", type: "string", required: true },
              { name: "href", label: "URL", type: "string", required: true },
              {
                name: "children",
                label: "Dropdown Children",
                type: "object",
                list: true,
                fields: [
                  { name: "label", label: "Label", type: "string", required: true },
                  { name: "href", label: "URL", type: "string", required: true },
                ],
              },
            ],
          },
          { name: "footerText", label: "Footer Text", type: "string" },
          {
            name: "socialLinks",
            label: "Social Links",
            type: "object",
            list: true,
            fields: [
              { name: "platform", label: "Platform", type: "string", required: true },
              { name: "url", label: "URL", type: "string", required: true },
            ],
          },
        ],
      },
      {
        name: "team",
        label: "Team",
        path: "content/team",
        format: "json",
        fields: [
          { name: "title", label: "Page Title", type: "string", required: true },
          { name: "headline", label: "Headline", type: "string" },
          { name: "subheadline", label: "Subheadline", type: "string" },
          {
            name: "members",
            label: "Team Members",
            type: "object",
            list: true,
            fields: [
              { name: "name", label: "Name", type: "string", required: true },
              { name: "title", label: "Title", type: "string" },
              { name: "bio", label: "Bio", type: "string", ui: { component: "textarea" } },
              { name: "photo", label: "Photo", type: "image" },
            ],
          },
        ],
      },
      {
        name: "careers",
        label: "Careers",
        path: "content/careers",
        format: "json",
        fields: [
          { name: "title", label: "Page Title", type: "string", required: true },
          { name: "headline", label: "Headline", type: "string" },
          { name: "subheadline", label: "Subheadline", type: "string" },
          { name: "intro", label: "Intro", type: "string", ui: { component: "textarea" } },
          { name: "cultureHeading", label: "Culture Heading", type: "string" },
          { name: "cultureBody", label: "Culture Body", type: "string", ui: { component: "textarea" } },
          {
            name: "featuredPosts",
            label: "Featured Blog Posts",
            type: "object",
            list: true,
            fields: [
              { name: "title", label: "Title", type: "string", required: true },
              { name: "href", label: "URL", type: "string", required: true },
            ],
          },
          {
            name: "jobs",
            label: "Job Postings",
            type: "object",
            list: true,
            fields: [
              { name: "title", label: "Job Title", type: "string", required: true },
              { name: "department", label: "Department", type: "string" },
              { name: "location", label: "Location", type: "string" },
              { name: "type", label: "Type", type: "string" },
              { name: "description", label: "Description", type: "string" },
              { name: "applyLink", label: "Apply Link", type: "string" },
            ],
          },
        ],
      },
      {
        name: "solution",
        label: "Solutions",
        path: "content/solutions",
        format: "json",
        fields: [
          { name: "title", label: "Page Title", type: "string", required: true },
          { name: "slug", label: "Slug", type: "string", required: true },
          { name: "headline", label: "Headline", type: "string" },
          { name: "subheadline", label: "Subheadline", type: "string" },
          { name: "body", label: "Body", type: "string", ui: { component: "textarea" } },
          {
            name: "features",
            label: "Features",
            type: "object",
            list: true,
            fields: [
              { name: "title", label: "Title", type: "string", required: true },
              { name: "description", label: "Description", type: "string" },
            ],
          },
        ],
      },
      {
        name: "product",
        label: "Products",
        path: "content/products",
        format: "json",
        fields: [
          { name: "title", label: "Page Title", type: "string", required: true },
          { name: "slug", label: "Slug", type: "string", required: true },
          { name: "headline", label: "Headline", type: "string" },
          { name: "subheadline", label: "Subheadline", type: "string" },
          { name: "body", label: "Body", type: "string", ui: { component: "textarea" } },
          {
            name: "features",
            label: "Features",
            type: "object",
            list: true,
            fields: [
              { name: "title", label: "Title", type: "string", required: true },
              { name: "description", label: "Description", type: "string" },
            ],
          },
        ],
      },
      {
        name: "mapExplorer",
        label: "Map Explorer",
        path: "content/map-explorer",
        format: "json",
        fields: [
          { name: "heading", label: "Heading", type: "string" },
          { name: "subheading", label: "Subheading", type: "string" },
          {
            name: "cards",
            label: "Property Cards",
            type: "object",
            list: true,
            fields: [
              { name: "label", label: "Label", type: "string", required: true },
              { name: "detail", label: "Detail Text", type: "string", required: true },
              {
                name: "color",
                label: "Color",
                type: "string",
                options: [
                  { value: "green", label: "Green" },
                  { value: "sky", label: "Blue" },
                  { value: "red", label: "Red" },
                  { value: "yellow", label: "Yellow" },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "about",
        label: "About",
        path: "content/about",
        format: "json",
        fields: [
          { name: "title", label: "Page Title", type: "string", required: true },
          { name: "headline", label: "Headline", type: "string" },
          { name: "subheadline", label: "Subheadline", type: "string" },
          { name: "historyHeading", label: "History Heading", type: "string" },
          { name: "historyBody", label: "History Body", type: "string", ui: { component: "textarea" } },
          {
            name: "milestones",
            label: "Milestones",
            type: "object",
            list: true,
            fields: [
              { name: "year", label: "Year", type: "string", required: true },
              { name: "event", label: "Event", type: "string", required: true },
            ],
          },
        ],
      },
    ],
  },
});
