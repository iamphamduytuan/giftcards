<template>
  <div class="app">
    <header class="app__header">
      <div class="container app__header-inner">
        <NuxtLink to="/" class="app__logo" aria-label="Gift Cards home">
          <svg class="app__logo-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M20 7h-2.2A3 3 0 0 0 12 4.9 3 3 0 0 0 6.2 7H4a1 1 0 0 0-1 1v4h1v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7h1V8a1 1 0 0 0-1-1Zm-5-1a1 1 0 1 1 0 2h-2V7a1 1 0 0 1 2-1ZM9 6a1 1 0 0 1 1 1v1H8a1 1 0 0 1 1-2Zm2 13H6v-7h5Zm7 0h-5v-7h5Zm1-9H5V9h6v1h2V9h6Z"
            />
          </svg>
          <span>Gift Cards</span>
        </NuxtLink>

        <ThemeToggle />
      </div>
    </header>

    <main class="app__main container">
      <Nuxt />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app__header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.app__header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.app__logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary-dark);
}

.app__logo-icon {
  width: 26px;
  height: 26px;
}

.app__main {
  flex: 1;
  padding-top: 24px;
  padding-bottom: 40px;
}
</style>
