<template>
  <section class="panel details" aria-labelledby="brand-details-title">
    <h2 id="brand-details-title" class="panel__title">
      <span class="panel__title-icon"><AppIcon name="info" /></span>
      Brand details
    </h2>

    <BrandSummary :brand="brand" class="details__summary" />

    <dl class="details__list">
      <div class="details__row">
        <dt class="details__label">
          <span class="details__icon"><AppIcon name="hash" /></span>
          Id
        </dt>
        <dd class="details__value">{{ brand.id }}</dd>
      </div>

      <div class="details__row">
        <dt class="details__label">
          <span class="details__icon"><AppIcon name="briefcase" /></span>
          Company
        </dt>
        <dd class="details__value">{{ brand.company }}</dd>
      </div>

      <div class="details__row">
        <dt class="details__label">
          <span class="details__icon"><AppIcon name="layers" /></span>
          Category
        </dt>
        <dd class="details__value">{{ brand.category }}</dd>
      </div>

      <div class="details__row">
        <dt class="details__label">
          <span class="details__icon"><AppIcon name="phone" /></span>
          Phone
        </dt>
        <dd class="details__value">
          <a :href="phoneHref" class="details__link">{{ brand.phone }}</a>
        </dd>
      </div>

      <div class="details__row">
        <dt class="details__label">
          <span class="details__icon"><AppIcon name="tag" /></span>
          Keywords
        </dt>
        <dd class="details__value">
          <ExpandableKeywords :keywords="brand.keywords" />
        </dd>
      </div>

      <div class="details__row">
        <dt class="details__label">
          <span class="details__icon"><AppIcon name="share" /></span>
          Social networks
        </dt>
        <dd class="details__value">
          <ul class="socials">
            <li v-for="social in socials" :key="social.name">
              <a
                :href="social.url"
                class="socials__link"
                :style="{ '--social-color': social.color }"
                :aria-label="`${brand.name} on ${social.label}`"
                :title="social.label"
                target="_blank"
                rel="noopener noreferrer"
              >
                <AppIcon :name="social.name" class="socials__icon" />
              </a>
            </li>
          </ul>
        </dd>
      </div>
    </dl>
  </section>
</template>

<script>
import { SOCIAL_NETWORKS } from '~/utils/icons'

export default {
  name: 'BrandDetailsPanel',
  props: {
    brand: { type: Object, required: true }
  },
  computed: {
    phoneHref() {
      return `tel:${this.brand.phone.replace(/[^\d+]/g, '')}`
    },
    // Only networks we have an icon for are rendered
    socials() {
      return Object.keys(this.brand.socialNetworks)
        .filter((name) => SOCIAL_NETWORKS[name])
        .map((name) => ({
          name,
          url: this.brand.socialNetworks[name],
          label: SOCIAL_NETWORKS[name].label,
          color: SOCIAL_NETWORKS[name].color
        }))
    }
  }
}
</script>

<style scoped>
.details__summary {
  margin-bottom: 20px;
}

.details__list {
  border-top: 1px solid var(--color-border);
}

.details__row {
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
}

.details__row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.details__label {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-muted);
  font-weight: 500;
}

/* Soft round badge behind every row icon */
.details__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  background: var(--color-primary-soft);
  border-radius: 50%;
  color: var(--color-primary-dark);
  font-size: 17px;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.details__row:hover .details__icon {
  background: var(--color-primary);
  color: #fff;
  transform: scale(1.06);
}

.details__value {
  min-width: 0;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.details__link {
  transition: color 0.2s ease;
}

.details__link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

/* ---------- Social networks ---------- */
.socials {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.socials__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: color-mix(in srgb, var(--social-color) 12%, var(--color-surface));
  border-radius: 50%;
  color: var(--social-color);
  font-size: 19px;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
}

.socials__link:hover,
.socials__link:focus-visible {
  background: var(--social-color);
  box-shadow: 0 6px 14px color-mix(in srgb, var(--social-color) 40%, transparent);
  color: #fff;
  transform: translateY(-3px);
}

.socials__link:active {
  transform: translateY(-1px) scale(0.95);
}

/* Browsers without color-mix still get a readable light circle */
@supports not (background: color-mix(in srgb, red 10%, white)) {
  .socials__link {
    background: var(--color-inactive-soft);
  }
}

@media (max-width: 560px) {
  /* Label above the value when the panel is narrow */
  .details__row {
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
    gap: 8px;
  }
}
</style>
