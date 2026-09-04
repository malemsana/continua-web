# Continua Frontend — Template Documentation

**Project:** Continua — School Study Material & Academic Catalogue  
**Stack:** Static HTML templates, vanilla CSS + JS, no build tooling, no framework dependencies  
**Design Authority:** Global shell (header/logo/nav), typography, color tokens, footer, responsive breakpoints reused across all templates  
**Date:** September 2026  
**Location:** `Continua-frontend/` — 25 HTML templates (including `resources/navigate.html`)

This document is a single combined reference for every HTML template in the project: what it is for, what it can do, what it needs, and how it relates to the whole site.

---

## 0. Design System Common to All Templates

**Tokens** (`:root` in every file):
- `--color-navy #1e293b / --color-navy-dark #0f172a`, `--color-bg-page #fff / --color-bg-hero #f8fafc`, `--color-border #e2e8f0 / --color-border-subtle #edf2f7`, `--color-text-main #0f172a / --color-text-subtle #475569 / --color-text-muted #64748b / --color-text-light #94a3b8`, `--font-serif` (Iowan/Garamond/Baskerville), `--font-sans` (system), `--max-width 1140px`, `--transition-standard 0.15s`.

**Global Shell (reused verbatim):**
- `.global-header` sticky navy header (64px), `header-brand` logo + `Continua` wordmark, `header-nav` (PYQ Library), `header-search` (280px, icon + input), `header-menu-btn` hamburger (3 bars → X), `mobile-nav-panel` drawer.
- `.breadcrumb-section` (Continua / …)
- `.global-footer` dense 6-col grid: Brand (logo/tagline/description/socials) + Classes + Subjects + Resources + Support + Legal (`CFEL 1.0 / NCERT E-Content / Terms of Service / Privacy Policy / Disclaimer`), `footer-bottom` ©. Responsive: 992px → 2fr 1fr 1fr, 768px → 1fr 1fr, 480px → 1fr.
- Typography: serif for titles, sans for body, `15px/1.5`, antialiased. Icons from `assets/` (maths/physics/chemistry/biology/science + `HomePageBackgroundArt-opt.webp`, `logo.svg`).
- JS baseline: mobile menu toggle (aria-expanded), Escape to close, `pushState`/`popstate` where needed. No framework, no router.

**Legal Family Reading Width:** `--legal-width 780px` (wider than 680px resource reader) for CFEL/NCERT/Terms/Privacy/Disclaimer.

---

## 1. Home & Catalogue Entry

### 1.1 `index.html` — Homepage / Catalogue Root
**Purpose:** The site's Level 0 entry; the primary Class → Subject → Chapter → Resource path.  
**Features:** `hero-section` (title, subtitle “Well-structured. Exam-focused. Always free.”, search label/input + button, `HomePageBackgroundArt-opt.webp` at 520px/0.65 opacity), `classes-section` with `Classes` label and `classes-list`. Each `class-block` shows `class-numeral` (serif, `cbd5e1`) + `class-name`, and a `class-subjects-grid` (4-col → 2-col at 992px → 1-col at 768px) of `subject-cell` (48-52px icon, title, › arrow; hover `#f1f5f9` + `#cbd5e1`). Classes 12/11/10 visible, 9/8 in `expandable-classes` toggled by `View more classes` button.  
**Capabilities:** Client-side search shortcut (`/` focuses hero/header input), expand/collapse, mobile drawer; hero + header searches route to `search.html?q=` (authoritative search).  
**Requirements:** `assets/*_icon-opt.webp`, `logo.svg`, `HomePageBackgroundArt-opt.webp`; no backend; links to `/class-{n}/{subject}/`, `/resources/pyq-library/`.  
**States:** Default (3 classes), expanded (5 classes), mobile (single-column subjects with `#f8fafc` card).

### 1.2 `class.html` — Class Overview (Class 10)
**Purpose:** Level 1 catalogue for a single class (uses Class 10 as template). Lists subjects and chapters at a class scope.  
**Features:** Header, breadcrumbs `Continua / Class 10`, masthead with class numeral/subtitle, `subjects-grid` and per-subject chapter lists; reuses homepage subject-cell and class-block language.  
**Capabilities:** Navigate to `subject.html` (`/class-10/mathematics/`) or directly to `chapter.html`.  
**Requirements:** Same assets as homepage; works without subjects (empty state falls back to `empty-catalogue.html` language).

### 1.3 `subject.html` — Subject Overview (Class 10 Mathematics)
**Purpose:** Lists all chapters for a class+subject.  
**Features:** Breadcrumbs `Continua / Class 10 / Mathematics`, subject masthead, `chapters-list` with numbered rows (`01 — Real Numbers →` etc.) linking to `chapter.html`.  
**Capabilities:** Chapter-level entry to 6 canonical resources per chapter.  
**Requirements:** Chapter metadata (num/name/slug); chapter pages under `/class-10/mathematics/{slug}/`.

### 1.4 `chapter.html` — Chapter Hub (Class 10 Mathematics — Real Numbers)
**Purpose:** Canonical Level 2 hub for a single chapter; the junction `Chapter → Resource`.  
**Features:** Breadcrumbs (4 levels), `chapter-masthead` (numeral `01`, title, subtitle, desc), `resources-section` with 6 `resource-entry` rows: NCERT (Textbook Reader), NCERT Solutions, Formulae Sheet, Reference, PYQs, Mock Tests — each with `resource-icon-wrap` SVG, `resource-title` + `resource-badge`, `resource-desc`, `resource-meta-row` + `resource-quick-links`, right arrow. Hover highlights. `chapter-pager` to TOC / Next Chapter.  
**Capabilities:** Unified sequential list, no separate pages per resource type beyond links; ready for Builder population from manifests.  
**Requirements:** 6 resource URLs under `/class-10/mathematics/real-numbers/{ncert|ncert-solutions|formulae|reference|pyq|mock-tests}/`; canonical links required.

---

## 2. Resource Viewer Templates (Chapter-Scoped)

All viewers share a 680px (generic) / 780px (legal) reading shell, sticky breadcrumbs, pager, and the same header/footer.

### 2.1 `ncert-reader.html` — NCERT Textbook PDF Viewer
**Purpose:** Displays the official NCERT PDF (60% width desktop → full-width on mobile) with toolbar.  
**Features:** `reader-toolbar` with Back-to-Hub, doc title/meta, “Open in Tab” + 3-dot `more-menu` (Download, Copy Link, Print popover), `pdf-viewport-section` with 60%/75%/85%/100% responsive widths, `pdf-viewport-wrapper` (750px min, shadow, border), `pdf-loading-state` spinner, `pdf-embed-frame` iframe, fallback card with Open/Download buttons. Blob fetch + `URL.createObjectURL` with fallback.  
**Capabilities:** Inline PDF, new-tab open, download, copy shareable link (clipboard), print, outside-click/Escape dismiss.  
**Requirements:** PDF URL `https://raw.githubusercontent.com/malemsana/continua-resource/.../c10_mathemat_ch1_ncert.pdf` (or manifest-provided); CORS-enabled fetch; `assets/logo.svg`.

### 2.2 `ncert-solutions.html` — NCERT Solutions Reader
**Purpose:** Step-by-step exercise solutions with KaTeX math (inferred from `c10_mathemat_ch1_sol.json` reference).  
**Features:** Editorial reading canvas `680px`, masthead, solution book typography, per-exercise navigation, quick links (`Ex 1.1`, etc.), pager.  
**Capabilities:** Renders structured Q&A from JSON; client-side math rendering.  
**Requirements:** `c10_mathemat_ch1_sol.json` + renderer `assets/continua-renderer.js`.

### 2.3 `ncert-formulae.html` — Formulae Sheet
**Purpose:** High-yield revision sheet (definitions, theorems, factorization rules).  
**Features:** Same reading canvas as solutions; `Markdown + KaTeX Math Sheet` pill; formula derivations.  
**Requirements:** `c10_mathemat_ch1_formula.json`.

### 2.4 `examples.html` — Chapter Examples
**Purpose:** Worked examples illustrating key ideas (template).  
**Features:** Masthead `Chapter Examples`, file list semantics (icon + title + meta), quiet empty-state comment for Builder.  
**Capabilities:** Lists example sets per chapter; links to anchors or separate pages.  
**Requirements:** Example data JSON (e.g. `c10_mathemat_ch1_example.json`).

### 2.5 `reference.html` — Reference Material
**Purpose:** Supplementary teacher guides, mind-maps, extra notes.  
**Features:** Same `680px` canvas (with `@media (min-width:1200px)` left offset), `ref-list-label` “Files · N items”, `ref-file-item` rows (42px icon, title, meta, arrow; hover `#f1f5f9` + inset border), `ref-empty` dashed empty state.  
**Capabilities:** Handles PDF/PNG/ZIP mixed files; focus-visible outline.  
**Requirements:** File metadata (name, type, size).

### 2.6 `pyq.html` — PYQs (Chapter-Specific Board Exams)
**Purpose:** Chapter-filtered PYQs (2019–2024) with marking schemes.  
**Features:** Year → Question lists, `examination year` + `question count` pills, board-exam badge.  
**Capabilities:** Filter by year, show solutions.  
**Requirements:** `c10_mathemat_ch1_pyq.json`.

### 2.7 `mock-tests.html` — Mock Tests & Sample Papers
**Purpose:** Sectional unit tests + timed mocks with marking schemes.  
**Features:** `Mock Tests & Sample Papers` masthead, traditional collapsible dropdown groups, paper cards (QP + MS).  
**Capabilities:** Collapsible groups, title-style ordering.  
**Requirements:** Test-pack manifests.

---

## 3. Resource Navigator (Reverse Entry)

### 3.1 `resources/navigate.html` — Resource Navigator (Single Reusable Template)
**Purpose:** Reverse path `Resource → Class → Subject → Chapter → Resource` that converges on the same canonical resource pages as the normal `Class → Subject → Chapter → Resource` path. One physical file serves all resource types via `?resource=`.  
**Routes:** `/resources/navigate.html?resource=formulae` (same for `ncert-solutions`, `examples`, `reference`, `mock-tests`; PYQ Library excluded as global destination).  
**Features & States:**
- **No param:** `Browse by Resource` picker — 5 single-column `resource-card` (icon, title, desc, ›) in one column (not 2-col, to save space), plus PYQ note.
- **State 1 `?resource=formulae`:** Resource hero (name + description: e.g. “Concise, exam-ready formula sheets…”, path hint `Resources / Formulae · Class → Subject → Chapter`), `Classes` label, `classes-list` with `class-block` (e.g. CLASS 12: Mathematics/Physics/Chemistry/Biology, CLASS 10: Mathematics/Science) — only combinations that actually have the resource are shown. Class headers clickable to go to subjects.
- **State 2 `?resource=formulae&class=10`:** `SUBJECTS` row (Mathematics, Science) with back to classes.
- **State 3 `?resource=formulae&class=10&subject=mathematics`:** `CHAPTERS` list (`01 Real Numbers — Formulae Sheet →` etc.), each row links directly to permanent `/class-10/mathematics/real-numbers/formulae` (no query appended). Back to subjects/classes links.
- **Invalid `?resource=does-not-exist`:** Quiet `Resource Not Found` box + `Back to Resources / Browse Classes`.
- Dynamic breadcrumb `Continua / Resources / Formulae / Class 10 / Mathematics` and hero path bar; document title updates per resource.
**Capabilities:** Config mapping `RESOURCE_CONFIG` (id → display name/description/suffix/canonical pattern), `SUBJECT_META` (label/icon), `AVAILABILITY` (resource → class → subject → chapters[]) prototype static; production Builder will populate from manifests. `buildUrl`/`canonicalChapterUrl`, `history.pushState`/`popstate` keep URL shareable and Back/Forward natural; no separate HTML per class/subject.  
**Requirements:** `assets/*_icon-opt.webp`, `logo.svg`; JS enabled (noscript fallback). Link must be `resources/navigate.html` (relative `../assets` when served from `/resources/`).  
**Responsive:** Single-column resources always; 992px → 2-col subjects, 768px → 1-col subjects/cards, hero `1.7rem` → `1.55rem` at 480px, `360px` hides card desc and makes chapter CTA full-width. Matches homepage parity.

---

## 4. Search

### 4.1 `search.html` — Search Results Page (Extensible Template)
**Purpose:** Authoritative, Google-like search over Continua's own educational content (chapters, notes, solutions, examples, formulae, PYQs, mock tests, etc.). Instant dropdowns navigate here, not directly to a resource. Handles far more resources than a dropdown can.  
**Routes:** `/search?q=quadratic+equations&class=10&subject=mathematics` (also `search.html?...` for file protocol). Query + filters preserved in URL for share/bookmark/refresh/Back-Forward.  
**Features:**
- **Prominent search hero:** kicker + title `Search Continua`, input with icon/clear ×, `Search` button, Class (`All Classes` + 8-12) and Subject (`All Subjects` + mathematics/physics/chemistry/biology/science) selects that work together with `q`; active filter pills + `Clear filters`.
- **Result layout:** Clean scannable `results-list`; each `result-item` (icon, `result-title` + `result-badge` type label, `result-desc` + `result-excerpt` with `<mark>` highlight, `result-meta` Class · Subject · Chapter, `→` arrow) links to canonical page (`/class-{cls}/{subject}/{slug}/{type}`) — search URL never becomes the resource URL.
- **Five states:** Initial/empty (`/search` no `q` → “Search Continua” prompt, browse links, no fake search); Results found (count + list, `total` from provider); No results (friendly + actions: Try different, Remove filters, Search across all classes/subjects); Loading (3 skeleton `skeleton-item` pulse); Error (red `error-box` with `Retry`/`Clear`).
- **Extensibility:** Backend-agnostic. Clean interface `window.ContinuaSearchProvider.search({q,class,subject}) → {results,total}` and `window.ContinuaSearch.setProvider()` — no fake backend; `DefaultProvider` returns empty after 280ms (demo `?q=__error__` forces error). Underlying search can be replaced without redesign. Global search bars on every page (`header-search`, `mobile-search`, `hero-search`) wired to navigate to `search.html?q=` (see `index.html:1223` `navigateToSearch`).
- **Responsive:** 992px footer grid, 768px header collapses, search input + selects stack, at 480px input row becomes column with full-width button, filters column, result rows tighten, meta wraps.
**Requirements:** No backend required; JS enabled; uses existing tokens/icons; respects current resource architecture (class/subject/type/chapter) and does not invent metadata.

### 4.2 `search-no-results.html` — Legacy No-Results State Example
**Purpose:** Static design reference for the “No Results Found” quiet state (pre-search.html).  
**Features:** Centered `state-main` (`520px`, `cbd5e1` divider, query pill `“atomic structure”`, `Search Again` primary + `Browse Classes` secondary). Same header/footer as global.  
**Requirements:** None; not navigated to directly in production (superseded by `search.html`).

---

## 5. Legal / Document Family (780px, restrained, publisher-grade)

Shared template traits: no marketing hero/cards/illustrations, serif titles, comfortable `1.7` line-height, numbered `legal-section` with top border, `legal-placeholder` mono pills, blue links `#1d4ed8` underline `#93c5fd`, `legal-callout` left-accent, print hiding header/breadcrumbs.

### 5.1 `cfel.html` — Continua Free Educational License (CFEL) 1.0
**Purpose:** The free, non-commercial licence for original Continua content.  
**Features:** Breadcrumb `Continua / Legal / Continua Free Educational License`, kicker `Legal Document`, title + `Version 1.0 · Effective Date: 10/9/2026`, plain-English intro + two-card scope grid (Covered: explanations/solutions/questions/illustrations/metadata vs. Not covered: NCERT/government/textbooks — with blue `NCERT Copyright License` link `cfel.html:315` now `#1d4ed8` `cfel.html:126`), note linking to NCERT arrangement, divider `Full Licence` with find hint, verbatim 20-section document (`#cfel-s1`…`#cfel-s20`) including 3.1-3.5 subsections, commercial-use prohibitions, redistribution, modification, trademark, third-party, NCERT, endorsement, technological restriction, respect for copyright, individual restriction, changes, disclaimer “as is”, limitation, governing law (India), contact `continua.resource@gmail.com` (`cfel.html:570`) + `[WEBSITE]`.  
**Requirements:** None; mailto link; footer Legal now `CFEL 1.0 / NCERT E-Content / Terms of Service / Privacy Policy / Disclaimer` all `*.html`.

### 5.2 `ncert-licence.html` — NCERT E-Content Arrangement
**Purpose:** Relationship explainer + verbatim NCERT Copyright License.  
**Features:** Breadcrumb `Continua / Legal / NCERT E-Content Arrangement`, title + italic subtitle “How NCERT material is made available…”, intro + 5-bullet `At a glance` (Owner/Not Continua-owned/Governing licence/Not covered by CFEL/Continua's role = accessibility) and note, divider `Full Licence — NCERT` (source `www.ncert.nic.in/license-text/`), verbatim preamble (5 paragraphs) + 10 sections (Agreement, Reproduction, Distribution (no commercial/advertising/financial benefit), Sales or Hire, Attribution (logo/watermark), Adaptation “as is”, Technological Measures, Exceptions (Copyright Act 1957), Changes, Applicable Law Delhi), external links box `ncert-licence.html:361`.  
**Requirements:** No backend; links to `cfel.html`.

### 5.3 `terms.html` — Terms of Service (25 sections + Short Version)
**Purpose:** Authoritative terms for website/services/content.  
**Features:** Breadcrumb `Continua / Terms of Service`, title + `Last updated: [10/9/2026]`, intro summary, divider `Full Document` (25 sections + Short Version, find hint), preamble (3 paras), sections 1 About (resource list) through 25 Contact (`continua.resource@gmail.com` `terms.html:600` + `[WEBSITE]`), including 3 Content/Copyright (links to CFEL/NCERT), 4 Responsibilities (humorous “don't be the person…” line), 5 Scraping, 6-7 Accounts/User Content, 8 Copyright Complaints (`[EMAIL]` → `continua.resource@gmail.com` `terms.html:431`), 9 Availability, 10 Accuracy, 11 External Websites, 12 Third-Party Services, 13 Commercial Exploitation, 14 Suspension, 15 Changes, 16 Privacy (`privacy.html`), 17-18 Disclaimer/Limitation (see below), 19 Indemnification, 20 IP, 21 Severability, 22 No Waiver, 23 Entire Agreement, 24 Governing Law India, plus `Short Version` card `terms.html:605` (left navy accent, bold “Use Continua. Study…” / “Don't hack us…” / “Don't make us become unnecessarily evil lawyers.”). Internal blue links to CFEL/NCERT/Privacy.  
**Requirements:** Mailto link.

### 5.4 `privacy.html` — Privacy Policy (V1 Model, 14 sections)
**Purpose:** V1-accurate privacy for current architecture — no accounts, local practice data, honest analytics.  
**Features:** Breadcrumb `Continua / Privacy Policy`, title + `[DATE]`, intro (V1 without accounts, Free Flow local, Google Analytics + download counting) linking to Terms/CFEL/NCERT, divider (14 sections), sections: 1 About (V1 restrained), 2 Information We Collect (2.1 Analytics — pages/interactions/device/approx location/referral to extent configured; 2.2 aggregate download counts vs. personal library; 2.3 voluntary contact), 3 Locally Stored on Device (3.1 Free Flow local storage, 3.2 recent questions/attempts/answers/metadata, 3.3 clearing site data — with note distinguishing sent vs. local), 4 Accounts (no V1 accounts + future update notice), 5 How We Use, 6 Google Analytics & Third-Party (Continua vs. provider), 7 Cookies, 8 Retention, 9 Security, 10 Students/Younger Users (neutral, no unsupported COPPA claims), 11 Choices/Controls (browser/clear/opt-out), 12 Third-Party Links, 13 Changes, 14 Contact `continua.resource@gmail.com` `privacy.html:438`.  
**Requirements:** Honest: does not claim “we collect nothing”; distinguishes `data sent/processed` vs. `practice info on device`.

### 5.5 `disclaimer.html` — Disclaimer (9 sections, same liability limits)
**Purpose:** Educational-content disclaimer with identical warranties/limitation language as other legal pages.  
**Features:** Breadcrumb `Continua / Disclaimer`, title + `[DATE]`, intro linking to Terms/Privacy/CFEL/NCERT, divider (9 sections, find hint), sections: 1 General, 2 Educational Purpose Only, 3 No Guarantee of Accuracy (with verify note + CFEL/NCERT links), 4 External Links/Third-Party, 5 Availability, **`6 Disclaimer of Warranties`** (`“as is” and “as available”` + 6-item exclusions, `Nothing excludes…` `disclaimer.html:212`), **`7 Limitation of Liability`** (`indirect/incidental/consequential/special` + 6-item loss list, `Nothing excludes…` `disclaimer.html:225`) — verbatim same as `terms.html:531-558` / `cfel.html:546-556`, 8 Changes, 9 Contact (`continua.resource@gmail.com` `disclaimer.html:251`).  
**Requirements:** Footer Legal updated everywhere to `disclaimer.html` (bulk replaced `/disclaimer/` → `disclaimer.html` in 21 files).

---

## 6. About & Contact

### 6.1 `about.html` — About Continua & Contact Us (Combined)
**Purpose:** Small, established publisher explaining itself + one door to contact; not corporate SaaS.  
**Features:** Breadcrumb `Continua / About & Contact`, kicker `About`, title `About Continua`, `page-lead` (“independent educational platform/project focused on making study materials easier…”, now `about.html:206`), sections: **About Continua** (purpose + 9-item resource list: structured materials, chapter organization, NCERT, solutions/examples, formulae/revision, PYQs, Mock Tests & Sample Papers, reference, other — `about.html:229`), **The Founder** (subordinate `founder-card` `about.html:129`: `Ningombam Malemsana` / `Founder of Continua` / `Based in Manipur, India` + “Continua was founded and developed by Ningombam Malemsana.” + footnote distinguishing platform vs. founder / future company — `about.html:299`), **How Continua handles content** (4-item mixture: original/third-party/NCERT/links; no ownership claim; links to CFEL/NCERT/Terms/Privacy `about.html:250`), **Contact Us** (single unified channel, no departments; `contact-card` `about.html:263` with `continua.resource@gmail.com` pill `about.html:333` + `[WEBSITE]`; inactive prototype form: Name optional/Email/Message/Send Message `about.html:273`; copyright note same channel + Terms link).  
**Capabilities:** Minimal, editorial; visually findable contact but part of same page; responsive form stacks at 480px.  
**Requirements:** Placeholders replaced only for email; no invented teams/phones/stats/history.

---

## 7. Utility / System States

### 7.1 `404.html` — Page Not Found
**Purpose:** 1100+ line branded 404 (shares header/footer tokens).  
**Features:** Centered quiet state: search kicker/title, message, query pill, primary/secondary actions; same header/footer as global.  
**Requirements:** None; linked from footer Legal vs. true 404 via server.

### 7.2 `generic-error.html` — Something Went Wrong
**Purpose:** Generic 5xx / unhandled exception state.  
**Features:** `state-main` flex center, `cbd5e1` divider, `Something Went Wrong` heading, retry/browse actions; same responsive footer grid.  
**Requirements:** None.

### 7.3 `search-no-results.html` — Legacy No-Results Example
**Purpose:** Pre-`search.html` static quiet example (see Search section for superseding template).  
**Features:** `state-inner` (`520px`, `1.85rem` heading), `No matches for “atomic structure”` query pill.  
**Requirements:** Superseded by `search.html`; kept as reference.

### 7.4 `empty-catalogue.html` / `empty-chapter.html` — Empty Catalogue/Chapter
**Purpose:** Quiet “No Resources Available” when a catalogue or chapter has no published resources (Builder will populate later).  
**Features:** Dashed `ref-empty` / centered state box, minimal text, no fake resources.  
**Requirements:** Builder determines emptiness from manifests.

### 7.5 `resource-unavailable.html` — Resource Unavailable
**Purpose:** Single resource not yet published / temporarily unavailable.  
**Features:** `Resource Unavailable` title, explanation, back to Chapter Hub / Browse actions, same header/footer.  
**Requirements:** Chapter-level linking.

---

## 8. Legacy / Reference Templates (Chapter-Scoped Examples)

### 8.1 `subject.html`, `class.html`, `chapter.html` (see §1)
### 8.2 `examples.html`, `mock-tests.html`, `ncert-formulae.html`, `ncert-reader.html`, `ncert-solutions.html`, `pyq.html`, `reference.html`
All are thin wrappers around the **Resource Viewer** patterns above (see §2). `temp.html` is an ad-hoc playground copy of the homepage. They demonstrate file-per-resource vs. the newer single-file `resources/navigate.html` reverse-entry approach.

---

## 9. Cross-Cutting Requirements & Conventions

- **Routing / Query Params:** `search.html?q=&class=&subject=` and `resources/navigate.html?resource=&class=&subject=` share bookmarkable, history-aware state. Canonical resource URLs are *always* `/class-{n}/{subject}/{chapter}/{resource}` without query; navigator/search never appends query to the canonical target. `history.pushState` + `popstate` required.
- **Assets Paths:** `assets/` from root pages, `../assets/` from `/resources/navigate.html`. `logo.svg`, `maths/physics/chemistry/biology/science_icon-opt.webp`, `HomePageBackgroundArt-opt.webp`, favicons. Missing assets must not break layout (icons have `alt=""`).
- **Footer Links Canonical:** Legal column must be `cfel.html / ncert-licence.html / terms.html / privacy.html / disclaimer.html` (all relative `*.html` for file protocol; production rewrites `/disclaimer/` etc. to those files — bulk fix applied in 21 files). Resources column: `ncert-solutions / pyq-library / formulae / reference-materials / notes / Mock Tests & Sample Papers` (`/resources/practice-papers/` href retained, label now `Mock Tests & Sample Papers` — 23 files). Support column: `about.html` for About & Contact.
- **Placeholders:** `[EMAIL ADDRESS]` → `continua.resource@gmail.com` (4 files: `cfel.html:570`, `terms.html:431/600`, `privacy.html:438`, `about.html:333`); `[WEBSITE]` retained until live domain supplied; `[DATE]` / `[10/9/2026]` retained verbatim per spec.
- **No Fake Backend:** `search.html` `DefaultProvider` returns empty; `resources/navigate.html` `AVAILABILITY` is prototype static — Builder replaces from published manifests. Do not invent accounts, tracking beyond Google Analytics, or personalization.
- **Accessibility:** Breadcrumbs `schema.org/BreadcrumbList`, `aria-live="polite"` for navigator/search, `aria-expanded` on hamburger/menus, `focus-visible` outlines, `aria-label` on search inputs, `noscript` fallbacks.
- **Printing:** `@media print` hides `global-header`/`breadcrumb-section`/`footer-socials`.

---

## 10. File Inventory

| File | Purpose |
|------|---------|
| `index.html` | Homepage catalogue (Class 12/11/10 + hero search) |
| `class.html` | Class overview |
| `subject.html` | Subject → chapters |
| `chapter.html` | Chapter hub (6 resources) |
| `ncert-reader.html` | NCERT PDF viewer (blob iframe) |
| `ncert-solutions.html` | NCERT Solutions reader |
| `ncert-formulae.html` | Formulae Sheet |
| `examples.html` | Chapter Examples |
| `reference.html` | Reference Material (file list) |
| `pyq.html` | PYQs (chapter-specific) |
| `mock-tests.html` | Mock Tests & Sample Papers |
| `resources/navigate.html` | **Single reusable Resource Navigator** (resource-first entry) |
| `search.html` | **Search Results Page** (extensible, query + filters, 5 states) |
| `search-no-results.html` | Legacy quiet no-results example |
| `cfel.html` | CFEL 1.0 verbatim (20 sections) |
| `ncert-licence.html` | NCERT Arrangement + 10-section licence verbatim |
| `terms.html` | Terms of Service (25 sections + Short Version verbatim) |
| `privacy.html` | V1 Privacy Policy (14 sections) |
| `disclaimer.html` | Disclaimer (9 sections, same liability limits as Terms/CFEL) |
| `about.html` | About & Contact (+ The Founder) |
| `404.html` | Page Not Found |
| `generic-error.html` | Something Went Wrong |
| `empty-catalogue.html` / `empty-chapter.html` | Empty states |
| `resource-unavailable.html` | Resource unavailable |
| `temp.html` | Playground copy |

All templates are UI/template only — no Web Builder wiring, no runtime fetching, no production content loading, no backend contact handling — ready for the Builder to populate from manifests.
