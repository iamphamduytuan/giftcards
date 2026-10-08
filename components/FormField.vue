<template>
  <div class="field" :class="{ 'has-error': error }">
    <label class="field__label" :for="fieldId">{{ label }}</label>
    <slot />
    <p v-if="error" :id="`${fieldId}-error`" class="field__error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<script>
/**
 * Label + error wrapper. The input itself goes in the default slot and must use
 * `fieldId` as its id so the label and aria-describedby work.
 */
export default {
  name: 'FormField',
  props: {
    label: { type: String, required: true },
    fieldId: { type: String, required: true },
    error: { type: String, default: '' }
  }
}
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field__label {
  font-size: 14px;
  font-weight: 600;
}

.field__error {
  color: var(--color-danger);
  font-size: 13px;
}
</style>
