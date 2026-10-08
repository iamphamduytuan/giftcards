# Gift Cards - Brands and Gift Card Issuing

Frontend task built with **Nuxt 2 / Vue 2**, plain HTML5 and custom CSS3.
No UI framework and no CSS framework is used. The only dependency is Nuxt itself.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
npm test         # unit tests for validation and pagination
```

Use Node 16-22. The scripts set `--openssl-legacy-provider` because Nuxt 2 uses webpack 4.

## Pages

| Route | Description |
| --- | --- |
| `/` | Brand list (198 brands), pagination `?page=` and `?limit=` (10 / 20 / 50). The old `/brands` URL redirects here |
| `/brands/:id` | Brand details panel and Issue gift card panel |

## Structure

```
components/   BrandCard, BrandSummary, BrandPagination, BrandDetailsPanel,
              ExpandableKeywords, IssueGiftCardPanel, GiftCardForm,
              FormField, OptionGroup, StatusBadge, AppIcon, ThemeToggle
pages/        index (brand list), brands/index (redirect to /), brands/_id
services/     brandService.js   data access (async, easy to swap for a real API)
data/         brands.js         mock data
utils/        giftValidation.js, pagination.js   pure logic, unit tested
              icons.js                           SVG paths used by AppIcon
assets/css/   main.css          design tokens, reset and shared form styles
tests/        node:test unit tests
```
