# Website Improvement List

## Hero & First Impression

1. **Hero headline is generic — rewrite for specificity.** "Smarter Cities Start with Better Data" could be any govtech company. Compare to Vercel's "Build and deploy on the AI Cloud" — it names exactly what you do. Something like "Every parcel. Every owner. Every insight. One platform for your city." tells a visitor in 5 seconds what Tolemi actually is. The subheadline is also too long and vague.

2. **Hero needs a visible, dual CTA above the fold.** Right now the CTA is *below* the hero in a separate section after 250vh of scroll. Vercel and HubSpot both have two buttons directly under the headline — a primary ("Get a Demo") and a secondary ("See how it works" / product tour). Visitors who land and want to act shouldn't have to scroll at all.

3. **The slider interaction is unclear in purpose.** The three colored dots on SVG tracks are visually interesting but there's no label, no legend, no indication what they control. A first-time visitor won't understand they toggle map layers. Either add clear labels ("Flood zones", "Transit", "Heat islands") next to each slider, or replace with a simpler visual that communicates the product value more immediately.

## Content & Information Architecture

4. **Add a clear "What is Tolemi?" product callout section — like HubSpot's product cards.** Your inspiration screenshot shows HubSpot's 4-quadrant layout: Marketing Hub, Sales Hub, Service Hub, Content Hub — each with a one-liner and "Learn more." You should do this for Building Blocks, Slate, and Publicity. Currently visitors have to find the Products dropdown to learn what you even sell. Put it on the homepage.

5. **The DataFlow component should be promoted higher and made more compelling.** You noted the Vercel "data sources → insights" visual as inspiration. Your current DataFlow is buried and visually flat — thin grey lines, tiny text. This should be a showcase moment: bolder lines, animation on scroll, clear column headers ("Your City's Data" → "Tolemi" → "Actionable Insights"), and larger, more readable labels. This is the single best visual explanation of what Tolemi does.

6. **Stats section needs real, specific numbers — a la Salesforce.** "100+ Municipal Partners" and "3 States" are underwhelming for a section that's supposed to build trust. Your Salesforce inspiration shows "2.5M+ conversations handled" with supporting proof points. Consider: total properties tracked, permits processed by Slate, payments collected, violations resolved — real throughput numbers that show scale and make the product tangible.

7. **Add a "Who uses Tolemi?" case study section — like Esri's tabbed stories.** Your Esri inspiration shows a tabbed interface with real customer stories, maps, and narrative. Right now you have two short testimonials from people at fictional-sounding cities ("Maplewood", "Lakeville"). Replace these with named, real cities. Even better: add 2-3 deep-dive case study cards showing before/after impact.

8. **Add an FAQ section at the bottom — like Databricks.** You flagged this inspiration yourself. A compact accordion FAQ ("What data sources does Tolemi support?", "How long does onboarding take?", "Is Tolemi SOC 2 compliant?") would address common objections and pack a lot of value into a small space. Pair it with a "Schedule a Demo" button.

9. **Add an integrations/compatibility section — like HubSpot's "Works with the tools you already use."** For Tolemi this could be "Works with the systems your city already runs" — showing logos of common municipal platforms (Tyler Technologies, CivicPlus, Accela, etc.), GIS systems (Esri/ArcGIS), or data formats you ingest.

## Visual Design & Polish

10. ~~**Tighten the color usage.** You have 4 brand colors (green, sky, red, yellow) and they're applied everywhere — stat cards, feature dots, testimonial borders, CTA backgrounds, slider dots. The result is a bit carnival-like rather than the polished, dependable feel you want. Look at how Stripe uses bold color *sparingly* against a predominantly white/neutral canvas.
I do not want to make green my dominant color - i don't love the shade of green. maybe we can have a combination of colors like a pretty two-color gradient re-used a lot kind of like stripe does.~~
**DONE** — Replaced 4-color rotation with a signature indigo (#6366F1) + sky (#4CD5FF) two-color palette. Green/red/yellow only remain in hero map data visualization. All CTAs, accents, borders, gradients, and decorative elements now use the indigo-sky gradient.

11. **The city seals section (CityLogos) is visually noisy.** 249 scrolling seals in 3 rows with parallax is impressive technically but overwhelming visually. Most seals are low-resolution, different aspect ratios, and clash stylistically. Consider: show ~20-30 of your best/most recognizable city logos in a clean, single-row, grayscale treatment (like the standard "Trusted by" logo bars on every SaaS site). Quality over quantity.

12. ~~**Improve typography hierarchy and whitespace.** Your headings jump from very large (9xl hero) to somewhat samey section headers. The inspiration sites all use generous whitespace and clear size differentiation between section title, subtitle, and body. Some sections feel cramped (Features cards have a lot of dense mockup content). Let the design breathe more.~~
**DONE** — Added eyebrow labels (small uppercase text above section headings), scaled section headings to 3xl-5xl-6xl responsive range, increased section padding (py-32/py-40), widened gaps between heading blocks and content (mb-20-mb-24), and added more breathing room in feature cards (gap-16, py-24/py-32).

13. **Replace CSS mockups with real product screenshots.** The Features section has hand-coded HTML/SVG mockups of the UI (property cards, ownership tables, assessment charts). These are clever but look *designed for the marketing site* rather than being the *actual product*. Real product screenshots (even lightly styled) build more trust. If the product looks good, show it. Your HubSpot/Stripe inspiration screenshots all use actual product UI.

14. **The Investors section has 3 placeholder slots.** "Investor 2", "Investor 3", "Investor 4" as grey boxes looks unfinished. Either fill these with real investors or remove the section until you can. A half-populated trust section hurts more than no section at all.

## Interaction & UX

15. **Add a "See it in action" or product tour entry point.** Every inspiration site you saved has a secondary CTA that isn't just "Get a Demo." HubSpot has "Get Started Free", Vercel has "Start Deploying." Consider a self-serve interactive demo, a video walkthrough, or a "Take a Tour" link that shows the product without requiring a sales call. Govtech buyers do a lot of research before they engage.

16. **The Map Explorer section needs context and a payoff.** It shows Boston parcels with colored cards but doesn't explain why this matters or what the user would do with it. Add a heading that frames the value ("Drill into any property in your city") and a CTA at the end ("See your city's data →").

17. **Navigation dropdowns need more substance.** The header dropdowns just list 3 product names and 3 solution names with no descriptions. Compare to how HubSpot's nav has a brief description under each item. Adding a one-liner under each dropdown item ("Building Blocks — Foundational data infrastructure for municipalities") helps visitors self-select.

## Content & Copy

18. **Replace "Modern SAAS purpose-built" language.** The features subheading says "Modern SAAS purpose-built to put rich municipal data to use." This is jargon. City administrators don't care that it's SaaS. Rewrite from the buyer's perspective: "See your city's property data clearly — and act on it faster."

19. **Add a "Where to find us" / events section — like Esri's "New and newsworthy."** You flagged this inspiration. Govtech is a conference-heavy industry (ICMA, NLC, GTC). A small section showing upcoming events where Tolemi will be present builds credibility and gives prospects a low-commitment way to engage.

20. **The About and Team pages need photos and personality.** Team page has placeholder avatars. The About page is text-heavy with a timeline. For a startup selling trust to city governments, showing real faces and a genuine founding story matters. Prioritize getting real team photos in.

## Suggested Priority Order

| Priority | Items | Theme |
|----------|-------|-------|
| **P0 — Do first** | 1, 2, 6, 11, 14 | Fix what actively hurts credibility |
| **P1 — High impact** | 4, 5, 7, 10, 13 | Add missing persuasion elements |
| **P2 — Polish** | 3, 8, 9, 12, 17, 18 | Refine details and copy |
| **P3 — When ready** | 15, 16, 19, 20 | Additions that need content/assets |
