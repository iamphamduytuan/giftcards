import { brands } from '~/data/brands'
import { getTotalPages } from '~/utils/pagination'

/**
 * Brand data access layer.
 * Both functions are async on purpose: pages already await them, so replacing
 * the mock data with a real HTTP call only requires changing this file.
 */
export async function fetchBrands({ page = 1, limit = 20 } = {}) {
  const total = brands.length
  // Clamp the page so /?page=999 shows the last page instead of an empty list
  const safePage = Math.min(page, getTotalPages(total, limit))
  const start = (safePage - 1) * limit
  return {
    items: brands.slice(start, start + limit),
    total,
    page: safePage,
    limit
  }
}

export async function fetchBrandById(id) {
  return brands.find((brand) => brand.id === String(id)) || null
}
