const BRAND_COUNT = 198
const FIRST_BRAND_ID = 100001
const PRODUCT_COUNTS = [30, 100, 250, 300, 400]

// Base brands, repeated to build a list of 198 entries like the design
const BRAND_TEMPLATES = [
  { name: 'Grab', company: 'XYZ Limited', category: 'Other Gifts', logo: '/images/brands/grab.svg' },
  { name: 'Lazada', company: 'Lazada Singapore Pte Ltd', category: 'E-commerce', logo: '/images/brands/lazada.svg' },
  { name: 'Amazon', company: 'Amazon Asia-Pacific Resources', category: 'E-commerce', logo: '/images/brands/amazon.svg' },
  { name: 'Kaspersky Lab', company: 'Kaspersky Labs Singapore', category: 'Software', logo: '/images/brands/kaspersky.svg' },
  { name: 'Subway', company: 'Subway Singapore Pte Ltd', category: 'Food & Beverage', logo: '/images/brands/subway.svg' },
  { name: 'Esprit', company: 'Esprit Retail Pte Ltd', category: 'Fashion', logo: '/images/brands/esprit.svg' }
]

function pad(value, length) {
  return String(value).padStart(length, '0')
}

function buildPhone(index) {
  const block1 = pad((index * 137) % 10000, 4)
  const block2 = pad((index * 251) % 10000, 4)
  return `+65 6${block1.slice(1)} ${block2}`
}

function buildKeywords(name, category) {
  const lowerName = name.toLowerCase()
  const keywords = [
    lowerName,
    `${lowerName} gift`,
    `${lowerName} voucher`,
    'promo code',
    'discount',
    'deals',
    category.toLowerCase(),
    'gift card'
  ]
  return Array.from(new Set(keywords))
}

function buildSocialNetworks(name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  return {
    facebook: `https://www.facebook.com/${slug}`,
    twitter: `https://twitter.com/${slug}`,
    instagram: `https://www.instagram.com/${slug}`,
    linkedin: `https://www.linkedin.com/company/${slug}`
  }
}

function buildBrand(index) {
  const template = BRAND_TEMPLATES[index % BRAND_TEMPLATES.length]
  return {
    id: String(FIRST_BRAND_ID + index),
    name: template.name,
    image: template.logo,
    // Roughly 1 in 4 brands is inactive so both states are visible in the UI
    status: index % 4 === 3 ? 'inactive' : 'active',
    country: 'Singapore',
    products: PRODUCT_COUNTS[(index * 7) % PRODUCT_COUNTS.length],
    company: template.company,
    category: template.category,
    phone: buildPhone(index + 1),
    keywords: buildKeywords(template.name, template.category),
    socialNetworks: buildSocialNetworks(template.name)
  }
}

export const brands = Array.from({ length: BRAND_COUNT }, (_, index) => buildBrand(index))
