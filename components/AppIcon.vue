<template>
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(shape, index) in paths" :key="index" :d="shape" />
  </svg>
</template>

<script>
import { ICONS } from '~/utils/icons'

/**
 * Decorative icon. Size comes from the parent class (width / height / font-size),
 * color from `color` (stroke is currentColor).
 */
export default {
  name: 'AppIcon',
  props: {
    name: {
      type: String,
      required: true,
      validator: (value) => Object.keys(ICONS).includes(value)
    },
    strokeWidth: { type: [Number, String], default: 2 }
  },
  computed: {
    paths() {
      return ICONS[this.name]
    }
  }
}
</script>
