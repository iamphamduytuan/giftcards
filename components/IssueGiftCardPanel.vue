<template>
  <section class="panel" aria-labelledby="issue-title">
    <h2 id="issue-title" class="panel__title">
      <span class="panel__title-icon"><AppIcon name="gift" /></span>
      Issue gift card
    </h2>

    <!-- After a successful send the form is replaced by a confirmation -->
    <div v-if="result" class="success" role="status">
      <span class="success__badge"><AppIcon name="check" class="success__icon" /></span>
      <h3 class="success__title">Gift card issued successfully</h3>
      <p class="success__text">
        A ${{ result.amount }} {{ brand.name }} gift card is on its way to
        <strong>{{ result.recipient.email }}</strong>.
      </p>
      <button type="button" class="btn btn--primary success__reset" @click="issueAnother">
        Issue another gift card
      </button>
    </div>

    <template v-else>
      <h3 class="form-title">Gift information</h3>
      <GiftCardForm ref="form" @submit="handleSubmit" />
    </template>
  </section>
</template>

<script>
import { buildGiftPayload } from '~/utils/giftValidation'

export default {
  name: 'IssueGiftCardPanel',
  props: {
    brand: { type: Object, required: true }
  },
  data() {
    return { result: null }
  },
  watch: {
    // Switching brand must not keep a result of the previous one
    'brand.id'() {
      this.result = null
    }
  },
  methods: {
    handleSubmit(form) {
      this.result = buildGiftPayload(form, this.brand)
      console.log('Gift card issued:', this.result)
    },
    issueAnother() {
      this.result = null
    }
  }
}
</script>

<style scoped>
.form-title {
  margin-bottom: 16px;
  font-size: 15px;
  color: var(--color-muted);
  font-weight: 600;
}

.success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 32px 8px 16px;
  text-align: center;
  animation: success-in 0.35s ease both;
}

.success__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  margin-bottom: 6px;
  background: var(--color-primary-soft);
  border-radius: 50%;
  box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.12);
  color: var(--color-primary-dark);
}

.success__icon {
  width: 36px;
  height: 36px;
}

.success__title {
  font-size: 20px;
  font-weight: 700;
}

.success__text {
  max-width: 340px;
  color: var(--color-muted);
  overflow-wrap: anywhere;
}

.success__text strong {
  color: var(--color-text);
}

.success__reset {
  margin-top: 12px;
}

@keyframes success-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
