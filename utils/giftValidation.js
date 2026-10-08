export const PRESET_AMOUNTS = [10, 20, 30, 40]
export const CUSTOM_AMOUNT = 'custom'

export const DELIVERY_TYPES = {
  PERSONAL: 'personal',
  GIFT: 'gift'
}

export const DELIVERY_TIMES = {
  IMMEDIATELY: 'immediately',
  CUSTOM: 'custom'
}

export const PERIODS = ['morning', 'afternoon', 'evening']

export const LIMITS = {
  minAmount: 5,
  maxAmount: 500,
  maxNameLength: 50,
  maxMessageLength: 200
}

export const PHONE_COUNTRY_CODE = '+65'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// Singapore numbers have 8 digits and start with 3, 6, 8 or 9
const SG_PHONE_PATTERN = /^[3689]\d{7}$/
// Letters (including accents), spaces, apostrophes, dots and hyphens
const NAME_PATTERN = /^[\p{L}][\p{L} '.-]*$/u

export function createEmptyGiftForm() {
  return {
    amountOption: PRESET_AMOUNTS[0],
    customAmount: '',
    deliveryType: DELIVERY_TYPES.PERSONAL,
    senderName: '',
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    deliveryTime: DELIVERY_TIMES.IMMEDIATELY,
    deliveryDate: '',
    period: PERIODS[0],
    giftMessage: ''
  }
}

/**
 * Which fields are shown depends on the user inputs.
 * The form component and the validation both use these helpers,
 * so a hidden field can never block the submit.
 */
export function isGift(form) {
  return form.deliveryType === DELIVERY_TYPES.GIFT
}

export function isCustomAmount(form) {
  return form.amountOption === CUSTOM_AMOUNT
}

export function isScheduled(form) {
  return isGift(form) && form.deliveryTime === DELIVERY_TIMES.CUSTOM
}

export function getAmount(form) {
  if (isCustomAmount(form)) return Number(form.customAmount)
  return Number(form.amountOption)
}

/** Returns today as YYYY-MM-DD in the local time zone. */
export function getTodayString(now = new Date()) {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function normalizePhone(value) {
  // Accept "9123 4567", "9123-4567" or "+65 9123 4567" and keep the local digits
  const digits = String(value || '').replace(/\D/g, '')
  return digits.length === 10 && digits.startsWith('65') ? digits.slice(2) : digits
}

function validateName(value, requiredMessage, label) {
  const name = String(value || '').trim()
  if (!name) return requiredMessage
  if (name.length < 2) return `${label} must have at least 2 characters`
  if (name.length > LIMITS.maxNameLength) {
    return `${label} must have at most ${LIMITS.maxNameLength} characters`
  }
  if (!NAME_PATTERN.test(name)) return `${label} contains invalid characters`
  return ''
}

function validateAmount(form) {
  if (!isCustomAmount(form)) {
    return PRESET_AMOUNTS.includes(Number(form.amountOption)) ? '' : 'Please select gift amount'
  }
  const raw = String(form.customAmount).trim()
  if (!raw) return 'Please enter gift amount'
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) return 'Gift amount must be a valid number'
  const amount = Number(raw)
  if (amount < LIMITS.minAmount) return `Minimum gift amount is $${LIMITS.minAmount}`
  if (amount > LIMITS.maxAmount) return `Maximum gift amount is $${LIMITS.maxAmount}`
  return ''
}

function validateEmail(value) {
  const email = String(value || '').trim()
  if (!email) return 'Please enter recipient email'
  if (!EMAIL_PATTERN.test(email)) return 'Please enter a valid email address'
  return ''
}

function validatePhone(value) {
  const raw = String(value || '').trim()
  if (!raw) return 'Please enter recipient phone'
  if (!SG_PHONE_PATTERN.test(normalizePhone(raw))) {
    return 'Please enter a valid 8-digit Singapore phone number'
  }
  return ''
}

function validateDeliveryDate(value, now) {
  if (!value) return 'Please enter delivery date'
  // Both values are YYYY-MM-DD so a plain string comparison is correct
  if (value < getTodayString(now)) return 'Delivery date cannot be in the past'
  return ''
}

function validateMessage(value) {
  const message = String(value || '').trim()
  if (!message) return 'Please enter gift message'
  if (message.length > LIMITS.maxMessageLength) {
    return `Gift message must have at most ${LIMITS.maxMessageLength} characters`
  }
  return ''
}

/**
 * Validates only the fields that are currently visible.
 * Returns an object with one message per invalid field (empty when valid).
 */
export function validateGiftForm(form, now = new Date()) {
  const checks = {
    amount: validateAmount(form),
    recipientEmail: validateEmail(form.recipientEmail),
    recipientPhone: validatePhone(form.recipientPhone)
  }

  if (isGift(form)) {
    checks.senderName = validateName(form.senderName, 'Please enter sender name', 'Sender name')
    checks.recipientName = validateName(
      form.recipientName,
      'Please enter recipient name',
      'Recipient name'
    )
    checks.giftMessage = validateMessage(form.giftMessage)
  }

  if (isScheduled(form)) {
    checks.deliveryDate = validateDeliveryDate(form.deliveryDate, now)
    checks.period = PERIODS.includes(form.period) ? '' : 'Please select a period'
  }

  return Object.keys(checks).reduce((errors, key) => {
    if (checks[key]) errors[key] = checks[key]
    return errors
  }, {})
}

/**
 * Builds the object that is printed after a successful submit.
 * Fields of hidden sections are left out on purpose.
 */
export function buildGiftPayload(form, brand) {
  const payload = {
    brand: { id: brand.id, name: brand.name },
    amount: getAmount(form),
    currency: 'SGD',
    deliveryType: form.deliveryType,
    recipient: {
      email: form.recipientEmail.trim(),
      phone: `${PHONE_COUNTRY_CODE}${normalizePhone(form.recipientPhone)}`
    }
  }

  if (isGift(form)) {
    payload.sender = { name: form.senderName.trim() }
    payload.recipient.name = form.recipientName.trim()
    payload.deliveryTime = form.deliveryTime
    if (isScheduled(form)) {
      payload.deliveryDate = form.deliveryDate
      payload.period = form.period
    }
    payload.giftMessage = form.giftMessage.trim()
  }

  return payload
}
