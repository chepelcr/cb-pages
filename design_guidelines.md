# Design Guidelines: Cuerpo de Banderas Website

## Design Approach: Reference-Based Institutional Design
Drawing inspiration from prestigious military academies and honor guard organizations, emphasizing dignity, tradition, and patriotic pride with formal yet accessible design patterns.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Costa Rican Red: #eb1a4e (brand primary)
- Deep Navy: 220 85% 15% (formal institutional accent)
- Pure White: 0 0% 100% (clean backgrounds)

**Supporting Colors:**
- Neutral Grey: #c4c4c4 (secondary elements)
- Light Grey: #f0f0f0 (background sections)
- Dark Text: #1a1a1a (primary text)

**Flag Heritage Accents:**
- Royal Blue: 220 100% 40% (sparingly for emphasis)
- Gold: 45 90% 55% (minimal use for honors/achievements)

### B. Typography
**Font Family:** Poppins (Google Fonts CDN)
- Headers: Poppins 600-700 weights
- Body: Poppins 400-500 weights
- Captions: Poppins 300 weight

**Hierarchy:**
- H1: 2.5rem (40px) - Page titles
- H2: 2rem (32px) - Section headers
- H3: 1.5rem (24px) - Subsections
- Body: 1rem (16px) - Standard text
- Caption: 0.875rem (14px) - Metadata

### C. Layout System
**Spacing Primitives:** Tailwind units of 2, 4, and 8
- Micro spacing: p-2, m-2 (8px)
- Standard spacing: p-4, m-4 (16px)
- Section spacing: p-8, m-8 (32px)

**Grid System:** Responsive columns with institutional card layouts

### D. Component Library

**Navigation:**
- Fixed header with institutional logo and clean menu
- Breadcrumb navigation for admin sections
- Footer with contact information and institutional links

**Cards:**
- Clean white cards with subtle shadows (shadow-md)
- Generous internal padding (p-6)
- Rounded corners (rounded-lg)
- Leader profile cards with formal portraits

**Forms (Admin Panel):**
- Structured form layouts with clear labels
- AWS Amplify authentication components styled to match
- Content management interfaces with validation
- Upload components for gallery management

**Data Displays:**
- Historical timeline with chronological leader information
- Gallery grid layouts for photos and videos
- Tabular displays for leadership archives
- Achievement and ceremony showcases

### E. Images

**Hero Section:**
Large hero image featuring the honor guard in formal ceremony dress, positioned prominently on homepage with overlay text showcasing "Cuerpo de Banderas - Tradición desde 1951"

**Gallery Images:**
- Ceremony photographs from patriotic celebrations
- Historical photos from 1951 onwards
- Leadership portraits in formal military attire
- Training and parade imagery

**Institutional Elements:**
- Costa Rican flag imagery integrated subtly
- Liceo de Costa Rica emblems and insignia
- Chilean-influenced ceremonial elements

## Key Design Principles

**Formal Institutional Aesthetic:**
- Clean, structured layouts conveying respect and tradition
- Balanced composition with ample whitespace
- Consistent visual hierarchy throughout all sections

**Patriotic Color Integration:**
- Strategic use of Costa Rican red as primary brand color
- Subtle flag-inspired accents without overwhelming the design
- Professional grey tones for supporting elements

**Historical Reverence:**
- Timeline designs honoring the 70+ year history
- Leadership galleries showcasing institutional continuity
- Ceremonial photography presented with dignity

**Accessibility and Usability:**
- High contrast ratios for readability
- Responsive design adapting to all devices
- Intuitive navigation respecting user expectations
- AWS Amplify authentication seamlessly integrated

This design framework creates a dignified, tradition-focused website that honors the Cuerpo de Banderas' rich heritage while providing modern functionality through the admin panel powered by AWS Cognito authentication.