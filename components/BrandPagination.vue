<template>
  <div class="pagination">
    <nav class="pagination__nav" aria-label="Pagination">
      <button
        type="button"
        class="pagination__btn"
        :disabled="page <= 1"
        aria-label="Previous page"
        @click="$emit('change-page', page - 1)"
      >
        <svg class="pagination__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>

      <template v-for="(item, index) in items">
        <span v-if="item === '...'" :key="`gap-${index}`" class="pagination__gap">...</span>
        <button
          v-else
          :key="item"
          type="button"
          class="pagination__btn"
          :class="{ 'is-current': item === page }"
          :aria-current="item === page ? 'page' : null"
          :aria-label="`Page ${item}`"
          @click="$emit('change-page', item)"
        >
          {{ item }}
        </button>
      </template>

      <button
        type="button"
        class="pagination__btn"
        :disabled="page >= totalPages"
        aria-label="Next page"
        @click="$emit('change-page', page + 1)"
      >
        <svg class="pagination__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </nav>

    <div class="pagination__side">
      <label class="pagination__size">
        <span>Per page</span>
        <span class="pagination__select-wrap">
          <select :value="limit" @change="$emit('change-limit', Number($event.target.value))">
            <option v-for="option in pageSizeOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <svg class="pagination__select-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 9l6 6 6-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </label>

      <p class="pagination__range" aria-live="polite">
        <strong>{{ range.from }}-{{ range.to }}</strong> of <strong>{{ total }}</strong> results
      </p>
    </div>
  </div>
</template>

<script>
import {
  PAGE_SIZE_OPTIONS,
  buildPageItems,
  getResultRange,
  getTotalPages
} from '~/utils/pagination'

export default {
  name: 'BrandPagination',
  props: {
    page: { type: Number, required: true },
    limit: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  computed: {
    pageSizeOptions: () => PAGE_SIZE_OPTIONS,
    totalPages() {
      return getTotalPages(this.total, this.limit)
    },
    range() {
      return getResultRange(this.page, this.limit, this.total)
    },
    items() {
      return buildPageItems(this.page, this.totalPages)
    }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px 20px;
}

/* Pill shaped bar that holds the round buttons */
.pagination__nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  padding: 5px;
  background: var(--color-surface);
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(16, 24, 40, 0.1);
}

.pagination__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease,
    transform 0.15s ease;
}

.pagination__btn:hover:not(:disabled):not(.is-current) {
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
}

.pagination__btn:active:not(:disabled) {
  transform: scale(0.92);
}

.pagination__btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.35);
}

.pagination__btn.is-current {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.4);
  cursor: default;
}

.pagination__btn:disabled {
  color: var(--color-muted);
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination__icon {
  width: 16px;
  height: 16px;
}

.pagination__gap {
  min-width: 28px;
  text-align: center;
  color: var(--color-muted);
  font-weight: 600;
  letter-spacing: 1px;
  user-select: none;
}

.pagination__side {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
}

.pagination__size {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text);
}

/* Native arrow is removed so the icon can never touch the border */
.pagination__select-wrap {
  position: relative;
  display: inline-flex;
}

.pagination__size select {
  height: 36px;
  padding: 0 40px 0 16px;
  appearance: none;
  -webkit-appearance: none;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.pagination__select-icon {
  position: absolute;
  top: 50%;
  right: 13px;
  z-index: 1;
  width: 16px;
  height: 16px;
  color: var(--color-text);
  pointer-events: none;
  transform: translateY(-50%);
  transition: color 0.2s ease;
}

.pagination__size select:hover {
  border-color: var(--color-primary);
}

.pagination__size:hover .pagination__select-icon,
.pagination__size select:focus-visible + .pagination__select-icon {
  color: var(--color-primary-dark);
}

.pagination__size select:focus-visible {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
}

.pagination__range {
  font-size: 13px;
  color: var(--color-muted);
}

.pagination__range strong {
  color: var(--color-text);
  font-weight: 600;
}

@media (max-width: 640px) {
  .pagination {
    flex-direction: column;
    align-items: stretch;
  }

  /* The bar always stays on one line: buttons share the width and shrink if needed */
  .pagination__nav {
    flex-wrap: nowrap;
    gap: 2px;
    padding: 4px;
  }

  .pagination__side {
    justify-content: space-between;
  }

  .pagination__btn {
    flex: 1 1 0;
    min-width: 0;
    max-width: 40px;
    height: 34px;
    padding: 0;
  }

  .pagination__gap {
    flex: 0 1 20px;
    min-width: 0;
  }
}
</style>
