<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="label"
    :title="label"
    :aria-pressed="isDark ? 'true' : 'false'"
    @click="toggle"
  >
    <!-- Both icons are always rendered; CSS shows the right one from html[data-theme],
         so the server rendered page never flashes the wrong icon. -->
    <span class="theme-toggle__icon theme-toggle__icon--sun"><AppIcon name="sun" /></span>
    <span class="theme-toggle__icon theme-toggle__icon--moon"><AppIcon name="moon" /></span>
  </button>
</template>

<script>
const STORAGE_KEY = 'theme'

export default {
  name: 'ThemeToggle',

  data() {
    return { isDark: false }
  },

  computed: {
    label() {
      return this.isDark ? 'Switch to light mode' : 'Switch to dark mode'
    }
  },

  mounted() {
    // The inline script in nuxt.config.js already applied the theme before first paint
    this.isDark = document.documentElement.dataset.theme === 'dark'
  },

  methods: {
    toggle() {
      this.isDark = !this.isDark
      const theme = this.isDark ? 'dark' : 'light'
      document.documentElement.dataset.theme = theme
      try {
        window.localStorage.setItem(STORAGE_KEY, theme)
      } catch (error) {
        // Storage can be blocked (private mode); the theme still works for this visit
      }
    }
  }
}
</script>

<!-- Not scoped on purpose: the rules depend on the attribute of the root element -->
<style>
.theme-toggle {
  position: relative;
  flex: none;
  width: 40px;
  height: 40px;
  padding: 0;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  color: var(--color-text);
  font-size: 20px;
  overflow: hidden;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease,
    transform 0.15s ease;
}

.theme-toggle:hover {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
  color: var(--color-primary-dark);
}

.theme-toggle:active {
  transform: scale(0.92);
}

.theme-toggle__icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.45s cubic-bezier(0.34, 1.26, 0.64, 1), opacity 0.25s ease;
}

/* Light mode shows the sun, the moon waits below and rotated */
.theme-toggle__icon--moon {
  opacity: 0;
  transform: translateY(100%) rotate(-90deg);
}

:root[data-theme='dark'] .theme-toggle__icon--sun {
  opacity: 0;
  transform: translateY(-100%) rotate(90deg);
}

:root[data-theme='dark'] .theme-toggle__icon--moon {
  opacity: 1;
  transform: none;
}
</style>
