<template>
  <section class="panel brands">
    <h1 class="page-title">Brands</h1>

    <ul class="brand-grid">
      <li v-for="brand in brands" :key="brand.id">
        <BrandCard :brand="brand" />
      </li>
    </ul>

    <BrandPagination
      :page="page"
      :limit="limit"
      :total="total"
      @change-page="goToPage"
      @change-limit="changeLimit"
    />
  </section>
</template>

<script>
import { fetchBrands } from '~/services/brandService'
import { parseListQuery } from '~/utils/pagination'

export default {
  name: 'BrandsPage',

  // Re-run asyncData whenever page or limit changes in the URL
  watchQuery: ['page', 'limit'],

  async asyncData({ query }) {
    const { items, total, page, limit } = await fetchBrands(parseListQuery(query))
    return { brands: items, total, page, limit }
  },

  head() {
    return { title: 'Brands' }
  },

  methods: {
    // The URL is the single source of truth, so the list is shareable and back button friendly
    goToPage(page) {
      this.updateQuery({ page, limit: this.limit })
      if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    changeLimit(limit) {
      this.updateQuery({ page: 1, limit })
    },
    updateQuery({ page, limit }) {
      this.$router.push({ path: this.$route.path, query: { page: String(page), limit: String(limit) } })
    }
  }
}
</script>

<style scoped>
.brands {
  padding: 28px 32px 32px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
}

/* 4 columns on desktop, fewer when the space gets smaller */
.brand-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 24px 22px;
  margin-bottom: 28px;
}

/* Tablet: 2 cards per row */
@media (max-width: 860px) {
  .brand-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Phone: 1 card per row so the card keeps a comfortable width */
@media (max-width: 560px) {
  .brands {
    padding: 20px 14px 24px;
  }

  .brand-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
}
</style>
