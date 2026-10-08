<template>
  <form class="gift-form" novalidate @submit.prevent="handleSubmit">
    <OptionGroup
      v-model="form.amountOption"
      legend="Select gift amount"
      name="amount"
      :options="amountOptions"
    />

    <FormField
      v-if="isCustomAmount"
      label="Custom amount"
      field-id="gift-customAmount"
      :error="visibleErrors.amount"
    >
      <div class="input-group" :class="{ 'is-invalid': visibleErrors.amount }">
        <span class="input-group__prefix" aria-hidden="true">$</span>
        <input
          id="gift-customAmount"
          v-model="form.customAmount"
          class="input"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          placeholder="Enter custom amount"
          :aria-invalid="hasError('amount')"
          :aria-describedby="describedBy('amount', 'gift-customAmount-error')"
          @blur="touch('amount')"
        />
      </div>
    </FormField>

    <OptionGroup
      v-model="form.deliveryType"
      legend="Delivery type"
      name="deliveryType"
      segmented
      :options="deliveryTypeOptions"
    />

    <!-- Sender and recipient names are only needed for a gift -->
    <template v-if="isGift">
      <FormField
        label="Sender name"
        field-id="gift-senderName"
        :error="visibleErrors.senderName"
      >
        <input
          id="gift-senderName"
          v-model="form.senderName"
          class="input"
          type="text"
          autocomplete="name"
          placeholder="Enter sender name"
          :aria-invalid="hasError('senderName')"
          :aria-describedby="describedBy('senderName', 'gift-senderName-error')"
          @blur="touch('senderName')"
        />
      </FormField>

      <FormField
        label="Recipient name"
        field-id="gift-recipientName"
        :error="visibleErrors.recipientName"
      >
        <input
          id="gift-recipientName"
          v-model="form.recipientName"
          class="input"
          type="text"
          autocomplete="off"
          placeholder="Enter recipient name"
          :aria-invalid="hasError('recipientName')"
          :aria-describedby="describedBy('recipientName', 'gift-recipientName-error')"
          @blur="touch('recipientName')"
        />
      </FormField>
    </template>

    <FormField
      label="Recipient email"
      field-id="gift-recipientEmail"
      :error="visibleErrors.recipientEmail"
    >
      <input
        id="gift-recipientEmail"
        v-model="form.recipientEmail"
        class="input"
        type="email"
        autocomplete="off"
        placeholder="Enter recipient email"
        :aria-invalid="hasError('recipientEmail')"
        :aria-describedby="describedBy('recipientEmail', 'gift-recipientEmail-error')"
        @blur="touch('recipientEmail')"
      />
    </FormField>

    <FormField
      label="Recipient phone"
      field-id="gift-recipientPhone"
      :error="visibleErrors.recipientPhone"
    >
      <div class="input-group" :class="{ 'is-invalid': visibleErrors.recipientPhone }">
        <span class="input-group__prefix" aria-hidden="true">{{ phoneCountryCode }}</span>
        <input
          id="gift-recipientPhone"
          v-model="form.recipientPhone"
          class="input"
          type="tel"
          inputmode="tel"
          autocomplete="off"
          placeholder="Enter recipient phone"
          :aria-invalid="hasError('recipientPhone')"
          :aria-describedby="describedBy('recipientPhone', 'gift-recipientPhone-error')"
          @blur="touch('recipientPhone')"
        />
      </div>
    </FormField>

    <template v-if="isGift">
      <OptionGroup
        v-model="form.deliveryTime"
        legend="Delivery time"
        name="deliveryTime"
        segmented
        :options="deliveryTimeOptions"
      />

      <!-- Date and period only appear when the gift is scheduled -->
      <template v-if="isScheduled">
        <FormField
          label="Delivery date"
          field-id="gift-deliveryDate"
          :error="visibleErrors.deliveryDate"
        >
          <div
            class="date-field"
            :class="{ 'is-invalid': visibleErrors.deliveryDate, 'has-value': form.deliveryDate }"
            @click="openDatePicker"
          >
            <span class="date-field__icon" aria-hidden="true">
              <AppIcon name="calendar" />
            </span>
            <input
              id="gift-deliveryDate"
              ref="dateInput"
              v-model="form.deliveryDate"
              class="date-field__input"
              type="date"
              :min="today"
              :aria-invalid="hasError('deliveryDate')"
              :aria-describedby="describedBy('deliveryDate', 'gift-deliveryDate-error')"
              @blur="touch('deliveryDate')"
            />
          </div>
        </FormField>

        <OptionGroup
          v-model="form.period"
          legend="Period"
          name="period"
          segmented
          :options="periodOptions"
        />
      </template>

      <FormField
        label="Gift message"
        field-id="gift-giftMessage"
        :error="visibleErrors.giftMessage"
      >
        <textarea
          id="gift-giftMessage"
          v-model="form.giftMessage"
          class="input"
          rows="4"
          placeholder="Enter gift message"
          :maxlength="limits.maxMessageLength"
          :aria-invalid="hasError('giftMessage')"
          :aria-describedby="describedBy('giftMessage', 'gift-giftMessage-error')"
          @blur="touch('giftMessage')"
        />
        <span class="gift-form__counter">
          {{ form.giftMessage.length }}/{{ limits.maxMessageLength }}
        </span>
      </FormField>
    </template>

    <button type="submit" class="btn btn--primary gift-form__submit">Send</button>
  </form>
</template>

<script>
import {
  CUSTOM_AMOUNT,
  DELIVERY_TIMES,
  DELIVERY_TYPES,
  LIMITS,
  PERIODS,
  PHONE_COUNTRY_CODE,
  PRESET_AMOUNTS,
  createEmptyGiftForm,
  getTodayString,
  isCustomAmount,
  isGift,
  isScheduled,
  validateGiftForm
} from '~/utils/giftValidation'

// Maps an error key to the id of the input that should receive focus
const FOCUS_TARGETS = {
  amount: 'gift-customAmount',
  senderName: 'gift-senderName',
  recipientName: 'gift-recipientName',
  recipientEmail: 'gift-recipientEmail',
  recipientPhone: 'gift-recipientPhone',
  deliveryDate: 'gift-deliveryDate',
  giftMessage: 'gift-giftMessage'
}

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1)

export default {
  name: 'GiftCardForm',

  data() {
    return {
      form: createEmptyGiftForm(),
      // Errors are only displayed for fields the user already touched (or after a submit)
      touched: {},
      today: getTodayString(),
      limits: LIMITS,
      phoneCountryCode: PHONE_COUNTRY_CODE,
      amountOptions: [
        ...PRESET_AMOUNTS.slice().reverse().map((amount) => ({ value: amount, label: `$${amount}` })),
        { value: CUSTOM_AMOUNT, label: 'Custom' }
      ],
      deliveryTypeOptions: [
        { value: DELIVERY_TYPES.PERSONAL, label: 'Personal' },
        { value: DELIVERY_TYPES.GIFT, label: 'Send as gift' }
      ],
      deliveryTimeOptions: [
        { value: DELIVERY_TIMES.IMMEDIATELY, label: 'Immediately' },
        { value: DELIVERY_TIMES.CUSTOM, label: 'Custom' }
      ],
      periodOptions: PERIODS.map((period) => ({ value: period, label: capitalize(period) }))
    }
  },

  computed: {
    isGift() {
      return isGift(this.form)
    },
    isCustomAmount() {
      return isCustomAmount(this.form)
    },
    isScheduled() {
      return isScheduled(this.form)
    },
    errors() {
      return validateGiftForm(this.form)
    },
    visibleErrors() {
      return Object.keys(this.errors).reduce((visible, key) => {
        if (this.touched[key]) visible[key] = this.errors[key]
        return visible
      }, {})
    }
  },

  watch: {
    // The amount error lives on the custom input, so switching back to a preset clears it
    'form.amountOption'(option) {
      if (option !== CUSTOM_AMOUNT) this.$delete(this.touched, 'amount')
    }
  },

  methods: {
    touch(key) {
      this.$set(this.touched, key, true)
    },

    // Clicking anywhere on the styled field opens the native calendar popup
    openDatePicker() {
      const input = this.$refs.dateInput
      if (!input) return
      input.focus()
      if (typeof input.showPicker === 'function') {
        try {
          input.showPicker()
        } catch (error) {
          // showPicker can throw if the browser blocks it; the native control still works
        }
      }
    },

    hasError(key) {
      return this.visibleErrors[key] ? 'true' : 'false'
    },

    describedBy(key, errorId) {
      return this.visibleErrors[key] ? errorId : null
    },

    handleSubmit() {
      const errorKeys = Object.keys(this.errors)
      if (errorKeys.length > 0) {
        errorKeys.forEach(this.touch)
        this.focusFirstInvalid(errorKeys)
        return
      }
      this.$emit('submit', { ...this.form })
    },

    focusFirstInvalid(errorKeys) {
      this.$nextTick(() => {
        // Follow the visual order of the form, not the order of the error object
        const order = Object.keys(FOCUS_TARGETS)
        const firstKey = order.find((key) => errorKeys.includes(key))
        const element = firstKey && document.getElementById(FOCUS_TARGETS[firstKey])
        if (element) element.focus()
      })
    },

    reset() {
      this.form = createEmptyGiftForm()
      this.touched = {}
    }
  }
}
</script>

<style scoped>
.gift-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.gift-form__counter {
  align-self: flex-end;
  font-size: 12px;
  color: var(--color-muted);
}

/* ---------- Delivery date field ---------- */
.date-field {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 46px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}

.date-field:hover {
  border-color: var(--color-border-strong);
}

.date-field:focus-within {
  border-color: var(--color-primary);
  box-shadow: var(--focus-ring);
}

.date-field__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 32px;
  height: 32px;
  margin-left: 8px;
  background: var(--color-primary-soft);
  border-radius: 50%;
  color: var(--color-primary-dark);
  font-size: 17px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.date-field:focus-within .date-field__icon {
  background: var(--color-primary);
  color: #fff;
}

.date-field__input {
  flex: 1;
  min-width: 0;
  height: 44px;
  padding: 0 12px;
  background: transparent;
  border: 0;
  outline: none;
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
}

/* Dim the placeholder-like dd/mm/yyyy text until a date is picked */
.date-field:not(.has-value) .date-field__input {
  color: var(--color-placeholder);
  font-weight: 500;
}

/* Hide the browser calendar icon, our own icon sits on the left */
.date-field__input::-webkit-calendar-picker-indicator {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.date-field.is-invalid {
  background: var(--color-danger-soft);
  border-color: var(--color-danger);
}

.date-field.is-invalid .date-field__icon {
  background: rgba(220, 38, 38, 0.12);
  color: var(--color-danger);
}

.date-field.is-invalid:focus-within {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.25);
}

.gift-form__submit {
  width: 100%;
  min-height: 46px;
  margin-top: 4px;
}
</style>
