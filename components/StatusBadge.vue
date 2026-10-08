<template>
  <span class="status" :class="`status--${status}`">
    <span class="status__dot" aria-hidden="true" />
    {{ label }}
  </span>
</template>

<script>
const LABELS = { active: 'Active', inactive: 'Inactive' }

export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true,
      validator: (value) => Object.keys(LABELS).includes(value)
    }
  },
  computed: {
    label() {
      return LABELS[this.status]
    }
  }
}
</script>

<style scoped>
.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 12px 3px 10px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  white-space: nowrap;
}

.status__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.status--active {
  background: var(--status-active-bg);
  border-color: var(--status-active-border);
  color: var(--status-active-text);
}

/* A soft halo on the dot tells "live" apart from "off" even without color */
.status--active .status__dot {
  box-shadow: 0 0 0 3px var(--status-active-halo);
}

.status--inactive {
  background: var(--color-inactive-soft);
  border-color: var(--color-border);
  color: var(--color-muted);
}
</style>
