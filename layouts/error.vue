<template>
  <div class="error-page container">
    <p class="error-page__code">{{ error.statusCode }}</p>
    <h1 class="error-page__title">{{ message }}</h1>
    <NuxtLink to="/" class="btn btn--primary">Back to brands</NuxtLink>
  </div>
</template>

<script>
export default {
  name: 'ErrorLayout',
  layout: 'default',
  props: {
    error: { type: Object, default: () => ({ statusCode: 500 }) }
  },
  head() {
    return { title: String(this.error.statusCode) }
  },
  computed: {
    message() {
      return this.error.statusCode === 404
        ? 'We could not find what you are looking for'
        : 'Something went wrong'
    }
  }
}
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-top: 96px;
  text-align: center;
}

.error-page__code {
  font-size: 64px;
  font-weight: 800;
  line-height: 1;
  color: var(--color-primary);
}

.error-page__title {
  font-size: 20px;
  margin-bottom: 8px;
}
</style>
