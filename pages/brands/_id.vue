<template>
  <section>
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink :to="backLink" class="breadcrumb__link">
        <AppIcon name="arrowLeft" class="breadcrumb__icon" />
        Brands
      </NuxtLink>
    </nav>

    <h1 class="sr-only">{{ brand.name }}</h1>

    <div class="layout">
      <BrandDetailsPanel :brand="brand" />
      <IssueGiftCardPanel :brand="brand" />
    </div>
  </section>
</template>

<script>
import { fetchBrandById } from '~/services/brandService'

export default {
  name: 'BrandDetailPage',

  async asyncData({ params, error }) {
    const brand = await fetchBrandById(params.id)
    if (!brand) {
      return error({ statusCode: 404, message: 'Brand not found' })
    }
    return { brand }
  },

  head() {
    return { title: this.brand.name }
  },

  computed: {
    // Keep the list page and page size the user came from, if any
    backLink() {
      const { page, limit } = this.$route.query
      return { path: '/', query: page || limit ? { page, limit } : {} }
    }
  }
}
</script>

<style scoped>
.breadcrumb {
  margin-bottom: 16px;
}

.breadcrumb__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px 7px 12px;
  background: var(--color-surface);
  border-radius: 999px;
  box-shadow: 0 1px 4px rgba(16, 24, 40, 0.12);
  font-weight: 600;
  transition: box-shadow 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.breadcrumb__link:hover {
  box-shadow: 0 6px 14px rgba(16, 24, 40, 0.14);
  color: var(--color-primary-dark);
  transform: translateX(-2px);
}

.breadcrumb__icon {
  width: 18px;
  height: 18px;
}

/* Two panels side by side on desktop, stacked on tablet and mobile */
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

@media (max-width: 860px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
