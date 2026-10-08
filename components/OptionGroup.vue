<template>
  <fieldset class="options">
    <legend class="options__legend">{{ legend }}</legend>
    <div
      class="options__list"
      :class="{ 'options__list--segmented': segmented }"
      :style="segmentedStyle"
    >
      <!-- Sliding pill behind the active tab (segmented mode only) -->
      <span
        v-if="segmented && activeIndex >= 0"
        class="options__thumb"
        :style="thumbStyle"
        aria-hidden="true"
      />
      <label
        v-for="option in options"
        :key="option.value"
        class="options__item"
        :class="{ 'is-selected': option.value === value }"
      >
        <input
          class="options__input"
          type="radio"
          :name="name"
          :value="option.value"
          :checked="option.value === value"
          @change="$emit('input', option.value)"
        />
        <span class="options__label">{{ option.label }}</span>
      </label>
    </div>
  </fieldset>
</template>

<script>
/**
 * Accessible radio group. Works with v-model.
 * Native radios stay in the DOM so keyboard and screen reader behavior is free.
 *
 * With `segmented`, the options are joined into one bar and a pill slides
 * under the selected option. The pill width and offset come from the option
 * count and the active index, so the animation is a plain CSS transform transition.
 */
export default {
  name: 'OptionGroup',
  props: {
    legend: { type: String, required: true },
    name: { type: String, required: true },
    value: { type: [String, Number], default: '' },
    options: { type: Array, required: true },
    segmented: { type: Boolean, default: false }
  },
  computed: {
    activeIndex() {
      return this.options.findIndex((option) => option.value === this.value)
    },
    segmentedStyle() {
      if (!this.segmented) return null
      return { gridTemplateColumns: `repeat(${this.options.length}, minmax(0, 1fr))` }
    },
    thumbStyle() {
      const count = this.options.length
      return {
        width: `calc((100% - var(--pad) * 2) / ${count})`,
        transform: `translateX(${Math.max(this.activeIndex, 0) * 100}%)`
      }
    }
  }
}
</script>

<style scoped>
.options {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.options__legend {
  padding: 0;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
}

.options__list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.options__item {
  position: relative;
  flex: 1 1 auto;
  min-width: 72px;
  padding: 9px 14px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.options__item:hover {
  border-color: var(--color-primary);
}

.options__item.is-selected {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
  color: var(--color-primary-dark);
}

/* Hide the radio visually but keep it focusable */
.options__input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}

.options__item:focus-within {
  box-shadow: var(--focus-ring);
}

/* ---------- Segmented variant with sliding indicator ---------- */
.options__list--segmented {
  --pad: 4px;
  position: relative;
  display: grid;
  gap: 0;
  padding: var(--pad);
  background: var(--color-inactive-soft);
  border-radius: 999px;
  isolation: isolate;
}

.options__thumb {
  position: absolute;
  top: var(--pad);
  bottom: var(--pad);
  left: var(--pad);
  z-index: 0;
  background: var(--color-primary);
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.35);
  transition: transform 0.35s cubic-bezier(0.34, 1.26, 0.64, 1);
  pointer-events: none;
}

.options__list--segmented .options__item {
  z-index: 1;
  min-width: 0;
  padding: 9px 8px;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: var(--color-muted);
  white-space: nowrap;
  transition: color 0.25s ease;
}

.options__list--segmented .options__item:hover {
  color: var(--color-text);
}

.options__list--segmented .options__item.is-selected {
  background: transparent;
  color: #fff;
}

.options__list--segmented .options__item:focus-within {
  box-shadow: var(--focus-ring);
}

@media (prefers-reduced-motion: reduce) {
  .options__thumb {
    transition: none;
  }
}
</style>
