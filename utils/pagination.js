export const PAGE_SIZE_OPTIONS = [10, 20, 50]
export const DEFAULT_PAGE_SIZE = 20

function toPositiveInt(value, fallback) {
  const parsed = parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

/**
 * Sanitizes `?page=` and `?limit=` from the URL so a malformed query
 * can never break the list.
 */
export function parseListQuery(query = {}) {
  const requestedLimit = toPositiveInt(query.limit, DEFAULT_PAGE_SIZE)
  const limit = PAGE_SIZE_OPTIONS.includes(requestedLimit) ? requestedLimit : DEFAULT_PAGE_SIZE
  return { page: toPositiveInt(query.page, 1), limit }
}

export function getTotalPages(total, limit) {
  return Math.max(1, Math.ceil(total / limit))
}

/**
 * Returns the range text parts for "101-110 of 198 results".
 */
export function getResultRange(page, limit, total) {
  if (total === 0) return { from: 0, to: 0 }
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)
  return { from, to }
}

/**
 * Builds the visible page buttons. The number of items stays constant
 * (siblings * 2 + 5) so the pagination bar does not jump while paging.
 * e.g. [1, 2, 3, 4, 5, '...', 10], [1, '...', 4, 5, 6, '...', 10]
 */
export function buildPageItems(current, totalPages, siblings = 1) {
  const slots = siblings * 2 + 5
  if (totalPages <= slots) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const range = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index)
  const edgeSize = siblings * 2 + 3
  const leftSibling = Math.max(current - siblings, 1)
  const rightSibling = Math.min(current + siblings, totalPages)
  const showLeftEllipsis = leftSibling > 3
  const showRightEllipsis = rightSibling < totalPages - 2

  if (!showLeftEllipsis) {
    return [...range(1, edgeSize), '...', totalPages]
  }
  if (!showRightEllipsis) {
    return [1, '...', ...range(totalPages - edgeSize + 1, totalPages)]
  }
  return [1, '...', ...range(leftSibling, rightSibling), '...', totalPages]
}
