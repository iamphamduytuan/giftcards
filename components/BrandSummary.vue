<template>
  <div class="hero">
    <div class="hero__top">
      <div class="hero__logo">
        <img :src="brand.image" :alt="`${brand.name} logo`" width="120" height="80" />
      </div>
      <div class="hero__body">
        <h3 class="hero__name">{{ brand.name }}</h3>
        <StatusBadge :status="brand.status" />
      </div>
    </div>

    <dl class="hero__stats">
      <div class="hero__stat">
        <dt><AppIcon name="globe" class="hero__stat-icon" /> Country</dt>
        <dd>{{ brand.country }}</dd>
      </div>
      <div class="hero__stat">
        <dt><AppIcon name="package" class="hero__stat-icon" /> Products</dt>
        <dd>{{ brand.products }}</dd>
      </div>
    </dl>
  </div>
</template>

<script>
/**
 * Image, name, status and featured details (country, products)
 * at the top of the brand details panel.
 */
export default {
  name: 'BrandSummary',
  props: {
    brand: { type: Object, required: true }
  }
}
</script>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero__top {
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;
}

.hero__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 128px;
  height: 88px;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  box-shadow: 0 4px 12px rgba(16, 24, 40, 0.06);
}

.hero__logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.hero__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
}

.hero__name {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

/* Same look as the strip at the bottom of a brand card */
.hero__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
}

.hero__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  min-width: 0;
  padding: 12px;
  text-align: center;
}

.hero__stat + .hero__stat {
  border-left: 1px solid var(--color-border);
}

.hero__stat dt {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text);
}

.hero__stat-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary-dark);
}

.hero__stat dd {
  max-width: 100%;
  font-size: 16px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 480px) {
  .hero__top {
    flex-direction: column;
    text-align: center;
  }

  .hero__body {
    align-items: center;
  }

  .hero__name {
    font-size: 22px;
  }
}
</style>
