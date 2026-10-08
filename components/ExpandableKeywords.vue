<template>
  <ul class="keywords">
    <li v-for="keyword in visibleKeywords" :key="keyword" class="keywords__item">
      {{ keyword }}
    </li>
    <li v-if="hiddenCount > 0">
      <button
        type="button"
        class="keywords__toggle"
        :aria-expanded="String(expanded)"
        :aria-label="expanded ? 'Show fewer keywords' : `Show ${hiddenCount} more keywords`"
        @click="expanded = !expanded"
      >
        <template v-if="expanded">Show less</template>
        <template v-else>+{{ hiddenCount }}</template>
        <AppIcon name="arrowLeft" class="keywords__chevron" :class="{ 'is-open': expanded }" />
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ExpandableKeywords',
  props: {
    keywords: { type: Array, default: () => [] },
    initialCount: { type: Number, default: 5 }
  },
  data() {
    return { expanded: false }
  },
  computed: {
    visibleKeywords() {
      return this.expanded ? this.keywords : this.keywords.slice(0, this.initialCount)
    },
    hiddenCount() {
      return Math.max(this.keywords.length - this.initialCount, 0)
    }
  },
  watch: {
    // A different brand should always start collapsed
    keywords() {
      this.expanded = false
    }
  }
}
</script>

<style scoped>
.keywords {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.keywords__item {
  padding: 4px 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.keywords__item:hover {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
}

.keywords__toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: var(--color-primary-soft);
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--color-primary-dark);
  font-size: 13px;
  font-weight: 700;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.keywords__toggle:hover {
  background: var(--color-primary);
  color: #fff;
}

/* The left arrow is rotated to point down (collapsed) and up (expanded) */
.keywords__chevron {
  width: 14px;
  height: 14px;
  transform: rotate(-90deg);
  transition: transform 0.25s ease;
}

.keywords__chevron.is-open {
  transform: rotate(90deg);
}
</style>
