<template>
  <NuxtLink :to="detailLink" class="brand-card" :aria-label="`View ${brand.name} brand`">
    <div class="brand-card__media">
      <img
        class="brand-card__logo"
        :src="brand.image"
        :alt="`${brand.name} logo`"
        width="200"
        height="120"
        loading="lazy"
      />
    </div>

    <div class="brand-card__info">
      <h2 class="brand-card__name">{{ brand.name }}</h2>
      <StatusBadge :status="brand.status" />
    </div>

    <dl class="brand-card__facts">
      <div class="brand-card__fact">
        <dt>
          <AppIcon name="globe" class="brand-card__fact-icon" />
          Country
        </dt>
        <dd>{{ brand.country }}</dd>
      </div>
      <div class="brand-card__fact">
        <dt>
          <AppIcon name="package" class="brand-card__fact-icon" />
          Products
        </dt>
        <dd>{{ brand.products }}</dd>
      </div>
    </dl>
  </NuxtLink>
</template>

<script>
export default {
  name: 'BrandCard',
  props: {
    brand: { type: Object, required: true }
  },
  computed: {
    // Carry page and limit along so the detail page can link back to the same list page
    detailLink() {
      const { page, limit } = this.$route.query
      return { path: `/brands/${this.brand.id}`, query: page || limit ? { page, limit } : {} }
    }
  }
}
</script>

<style scoped>
.brand-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--color-surface);
  /* The border stays visible in every state, including hover */
  border: 1px solid var(--color-border);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(16, 24, 40, 0.06);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.brand-card:hover {
  box-shadow: 0 14px 30px rgba(16, 24, 40, 0.14);
  transform: translateY(-4px);
}

/* Keyboard focus adds a visible ring for accessibility */
.brand-card:focus-visible {
  box-shadow: var(--focus-ring), 0 14px 30px rgba(16, 24, 40, 0.14);
  transform: translateY(-4px);
}

/* Fixed ratio keeps every card the same height whatever the logo shape is */
.brand-card__media {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 2 / 1;
  padding: 18px 28px;
  /* Brand logos are designed for white, so this area stays white in dark mode too */
  background: #fff;
}

.brand-card__logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.25s ease;
}

.brand-card:hover .brand-card__logo {
  transform: scale(1.04);
}

.brand-card__info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0 14px 14px;
}

.brand-card__name {
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  overflow-wrap: anywhere;
}

/* One strip glued to the bottom edge of the card: rounded on top, a single
   divider in the middle. The card's overflow hidden rounds the bottom corners. */
.brand-card__facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: auto;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  border-radius: 18px 18px 0 0;
}

.brand-card__fact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  min-width: 0;
  padding: 10px 12px 11px;
  text-align: center;
}

.brand-card__fact + .brand-card__fact {
  border-left: 1px solid var(--color-border);
}

.brand-card__fact dt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text);
}

.brand-card__fact-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  fill: none;
  /* Icon accent color: change this one value to restyle both icons */
  stroke: var(--color-primary-dark);
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.brand-card__fact dd {
  max-width: 100%;
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 640px) {
  .brand-card__media {
    padding: 14px 16px;
  }
}

/* One card per row on phones: keep the logo area compact instead of very tall */
@media (max-width: 560px) {
  .brand-card__media {
    aspect-ratio: auto;
    height: 130px;
  }
}
</style>
