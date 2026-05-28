# Uza Mobility — Frontend Design Brief

**For the design team · Not a technical document**

---

## What the Platform Is

Uza Mobility is Africa's electric mobility platform. It connects people who want to buy electric vehicles, businesses that want to electrify their fleets, charging station operators, spare parts suppliers, and energy solution providers — all in one place.

Think of it as a combination of AutoScout24 for vehicle discovery, a sourcing platform for importing EVs from China, a fleet management tool for organisations, and a charging station network — built specifically for the African market starting with Rwanda.

The platform has three public pillars:

- **Uza Mobility Marketplace** — buy EVs, parts, and accessories
- **Uza Mobility Fleet** — for businesses and organisations
- **Uza Mobility Energy** — charging stations and energy solutions

---

## Brand Feeling

The platform should feel:

- **Trusted** — like a bank or a serious logistics company, not a casual marketplace
- **Modern and clean** — comparable to global platforms like AutoScout24 or Carvana
- **African but global** — local context, international quality
- **Green and forward-looking** — sustainability is a core part of the brand, not an afterthought

Colors to explore: deep greens, clean whites, electric blues, with warm accent colors that feel premium. Avoid making it look cheap or classified-ad style.

---

## Pages Overview

### 1. Homepage

The homepage is the most important page. It needs to do several things at once: be a search entry point, show what's available, build trust, and communicate the platform's purpose in seconds.

**Top section — Hero**
Large, clean hero area with a bold headline about electric mobility in Africa. Behind it, a full search bar that lets users search across everything — vehicles, parts, charging stations. Below the search bar, quick category pills: Passenger EVs, Commercial Vehicles, Two-Wheelers, Parts, Charging Stations.

**Section — Browse by category**
Visual category cards with icons or clean illustrations. Each card takes you into a filtered marketplace view. Keep this simple and scannable.

**Section — New arrivals**
A horizontal scroll or grid of the latest published vehicle listings. Each card shows the vehicle photo, name, year, price, battery range, condition badge, and delivery estimate. Clean card design, no clutter.

**Section — Hot deals**
Similar to new arrivals but these have a deal badge. Price reduction clearly visible. Creates urgency without being aggressive.

**Section — Local stock**
Vehicles that are already in Rwanda, ready in 1–2 days. This is a key selling point — many buyers want fast delivery. Highlight this clearly.

**Section — China Direct**
Vehicles sourced from China. Show the 6–8 week delivery estimate honestly. The appeal here is price and variety. Show sourcing badges.

**Section — Best for taxi / Best for delivery / Best for family**
Use-case grouped sections. Buyers in Rwanda often know their purpose first. Help them self-identify quickly.

**Section — Charging stations map preview**
A small interactive map or visual showing charging stations near Kigali. A teaser that links to the full charging stations page. This reinforces that the platform supports the full EV lifestyle, not just vehicle sales.

**Section — Fleet solutions**
A banner or split section aimed at businesses. Short headline about fleet electrification. CTA to the Fleet page. Should feel more corporate and serious than the consumer sections.

**Section — Impact counters**
Animated counters showing platform-wide sustainability data: EVs delivered, CO2 emissions avoided, green kilometres enabled, fuel cost savings supported. This builds trust with eco-conscious buyers, NGOs, and government.

**Section — Featured suppliers / partners**
Logos of verified suppliers, bank partners, and charging network partners. Builds credibility.

**Footer**
Links to all main sections, contact information, WhatsApp link, social media, and a short brand statement.

---

### 2. Marketplace — Browse Listings Page

This is where users land after clicking a category or searching. It should feel like AutoScout24 or CarGurus — powerful filtering without feeling overwhelming.

**Left sidebar — Filters**
Collapsible filter groups: category, brand, model, year range, price range, condition, battery health, electric range, charger type, seller type, delivery time, use case, verification level. Filters apply in real time or with an apply button.

**Main area — Listing grid**
Clean vehicle cards in a responsive grid. Each card shows:

- Primary photo
- Verification badge if applicable (UZA Verified, Battery Verified, etc.)
- Brand and model
- Year · Condition · Mileage
- Battery range and charging type
- Seller type badge (Local Stock, China Direct, Local Seller)
- Delivery estimate
- Price in USD with RWF equivalent below
- Save / wishlist button

Toggle between grid view and list view. List view shows more specs per row.

**Top bar — Sort and results count**
Number of results, sort dropdown, and active filter tags with X to remove each one.

**Promoted listings**
Featured listings appear at the top of the grid with a subtle "Featured" tag. They look like regular listings but slightly elevated.

---

### 3. Listing Detail Page

The most important conversion page. A user lands here and decides whether to request an invoice.

**Left / Main column**
Large photo gallery with thumbnail strip. 360-degree view placeholder for future. Below the photos: full vehicle description, technical specifications table (battery capacity, range, motor power, charging type, fast charging support), condition details, and a compatibility section.

**Right column — sticky on desktop**

- Vehicle name and year
- Verification level badge
- Condition badge
- Price in USD and RWF
- Delivery estimate
- Seller type badge and seller name
- "Request Invoice" button — primary CTA, prominent
- "Request Financing Support" link — secondary, subtle
- WhatsApp inquiry button
- Save to wishlist

**Below the fold**
Seller information card. Verification report summary. Sustainability estimate (how much CO2 this vehicle would avoid vs a petrol equivalent). Similar listings.

---

### 4. Fleet Page

This page is aimed at businesses, taxi associations, schools, hotels, NGOs, and government bodies. The tone is more corporate and solutions-oriented.

**Hero**
Headline about fleet electrification. Subheadline about cost savings and sustainability. Two CTAs: "Submit Fleet Request" and "Contact Fleet Team".

**Section — Who this is for**
Icon grid showing buyer types: Taxi Association, Delivery Company, Corporate, School, Hotel, Government, Logistics, NGO. Each with a short one-liner about how the platform helps them.

**Section — How it works**
Step-by-step visual: Submit request → Get a quote → Receive invoice → Track delivery → Fleet operational. Clean numbered steps.

**Section — Fleet request form**
Embedded form on the page. Organisation name, contact, vehicle category, quantity, use case, budget range, financing needed checkbox, charging support needed checkbox. Short and non-intimidating.

**Section — Fleet impact**
Pull numbers from the sustainability engine: fleet vehicles delivered, total CO2 avoided by fleet clients, organisations served.

---

### 5. Charging Stations Page

The public-facing charging network directory.

**Top — Search and filter bar**
Search by city or use current location. Filter by charger type (AC, DC Fast, Ultra Rapid), vehicle compatibility, open 24 hours, pricing model (free, per kWh, per session), operational status.

**Main view — Map + list toggle**
Default view is a map showing station pins with color coding by operational status (green = operational, orange = partially operational, grey = offline). List view shows station cards.

Each station card shows:

- Station name and operator
- City and address
- Available ports out of total
- Fastest charger available (e.g. "Up to 150kW DC")
- Compatible vehicles
- Pricing summary (e.g. "From $0.12 / kWh")
- Operational status badge
- Distance if location is provided

**Station Detail Page**
Station name, address, photo gallery, map pin, opening hours. List of all charging ports with type, speed, power, and current availability status. Pricing breakdown. Vehicle compatibility list. Operator contact. Nearby stations.

---

### 6. Uza Mobility Energy Page

Separate from the charging stations directory. This is the product and solutions catalogue.

**Hero**
Focused on home and business energy solutions. Headline about clean energy and EV infrastructure.

**Product catalogue**
Cards for: Home Chargers, Commercial Chargers, Fleet Charging Systems, Solar + EV Packages, Battery Storage, Smart Charging, Energy Management Systems. Each card links to a product detail or a quote request.

**Quote request form**
Short form: client type, number of EVs, location, charger type needed, solar support needed, site visit requested, contact details.

---

### 7. Spare Parts Page

Similar layout to the main marketplace but adapted for parts.

Search bar at the top with a brand and model selector — users filter parts by their vehicle first. Then category filter: batteries, motors, chargers, connectors, brakes, body parts, accessories.

Parts cards show: part name, compatible vehicles, condition (new/used/refurbished), price, stock status, seller, delivery estimate.

---

### 8. Operator Dashboard — Charging Stations

This is the private area for approved charging station operators. Separate from the main consumer platform.

**Sidebar navigation**
Overview, My Stations, Add Station, Profile, Notifications.

**Overview**
Stats: total stations registered, active stations, pending review, total ports across all stations.

**My Stations list**
Each station shown with name, city, status badge, number of ports, and last updated date. Actions: Edit, Manage Ports, View Public Page.

**Station setup flow**
Step-by-step form: Basic Info → Location & Address → Charging Ports → Pricing → Photos → Vehicle Compatibility → Review & Submit. Progress indicator at the top. Each step can be saved as draft.

**Port management**
Within each station the operator sees a list of their ports. They can update status (Available, In Use, Faulted, Out of Service) at any time without going through admin review.

---

### 9. Seller Dashboard

Private area for approved vehicle and parts sellers.

**Sidebar navigation**
Overview, My Listings, Add Listing, Parts, Payouts, Profile.

**Overview**
Active listings, pending review, reserved, sold, and total views.

**Listing management**
Table of all listings with status, price, views, and date. Actions per row: Edit, View, Delete.

**Add listing flow**
Step-by-step: Category → Vehicle Details → EV Specs → Photos → Pricing → Use Cases → Review & Submit.

---

### 10. Buyer Dashboard

Private area for buyers.

**Sidebar navigation**
Overview, My Orders, Invoices, Saved Vehicles, Financing Requests.

**Orders**
Each order shows the vehicle, current status in a visual timeline, last update, and a View Details button. The timeline visually shows completed, current, and upcoming stages.

**Invoices**
List of all invoices with status badge, amount, validity date, and a Download PDF button.

**Saved vehicles**
Grid of saved listings with quick compare and request invoice buttons.

---

## Key UX Notes for the Designer

**Mobile is primary.** A significant portion of buyers in Rwanda will browse on mobile. Every page needs to work on a phone first.

**Pricing must be clear.** Always show USD as the main price with RWF below it. Never hide fees or make pricing confusing.

**Trust signals matter everywhere.** Verification badges, seller ratings, inspection reports, UZA Score — these should be visible and explained with tooltips, not hidden.

**WhatsApp is a key CTA.** In the African market WhatsApp is how business gets done. Every listing, fleet page, and energy page should have a visible WhatsApp button alongside the formal request flow.

**Delivery estimates must be honest.** Local stock (1–2 days), China sourcing (6–8 weeks), local seller (2–5 days). These should be clearly labelled and never downplayed. Trust is built by setting correct expectations.

**Loading states matter.** The marketplace has a lot of data. Skeleton loaders on listing cards, filters, and maps make the platform feel fast even when data is loading.

**Admin-facing pages are separate.** The admin panel is a different product from the public marketplace. It does not need to look like the consumer site — it needs to be functional and dense. The designer should treat it as a separate scope.
