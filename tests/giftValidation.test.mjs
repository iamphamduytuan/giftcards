import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createEmptyGiftForm,
  validateGiftForm,
  buildGiftPayload,
  normalizePhone,
  getTodayString
} from '../utils/giftValidation.js'
import { buildPageItems, getResultRange, parseListQuery } from '../utils/pagination.js'

const now = new Date(2026, 9, 8)
const brand = { id: '100001', name: 'Grab' }

function validPersonal() {
  return { ...createEmptyGiftForm(), recipientEmail: 'a@b.com', recipientPhone: '9123 4567' }
}

function validGift() {
  return {
    ...validPersonal(),
    deliveryType: 'gift',
    senderName: 'Tuan Pham',
    recipientName: 'Linh Nguyen',
    giftMessage: 'Happy birthday!'
  }
}

test('personal form only requires email and phone', () => {
  assert.deepEqual(validateGiftForm(validPersonal(), now), {})
  const errors = validateGiftForm(createEmptyGiftForm(), now)
  assert.deepEqual(Object.keys(errors).sort(), ['recipientEmail', 'recipientPhone'])
})

test('gift form requires sender, recipient and message', () => {
  const form = { ...validPersonal(), deliveryType: 'gift' }
  const errors = validateGiftForm(form, now)
  assert.deepEqual(Object.keys(errors).sort(), ['giftMessage', 'recipientName', 'senderName'])
  assert.deepEqual(validateGiftForm(validGift(), now), {})
})

test('custom amount rules', () => {
  const form = { ...validPersonal(), amountOption: 'custom' }
  assert.equal(validateGiftForm(form, now).amount, 'Please enter gift amount')
  assert.match(validateGiftForm({ ...form, customAmount: 'abc' }, now).amount, /valid number/)
  assert.match(validateGiftForm({ ...form, customAmount: '1' }, now).amount, /Minimum/)
  assert.match(validateGiftForm({ ...form, customAmount: '501' }, now).amount, /Maximum/)
  assert.equal(validateGiftForm({ ...form, customAmount: '25.5' }, now).amount, undefined)
})

test('scheduled delivery needs a date that is not in the past', () => {
  const form = { ...validGift(), deliveryTime: 'custom' }
  assert.equal(validateGiftForm(form, now).deliveryDate, 'Please enter delivery date')
  assert.match(validateGiftForm({ ...form, deliveryDate: '2026-10-07' }, now).deliveryDate, /past/)
  assert.deepEqual(validateGiftForm({ ...form, deliveryDate: '2026-10-08' }, now), {})
})

test('hidden fields never block submit', () => {
  const form = { ...validPersonal(), senderName: '1', giftMessage: '', deliveryTime: 'custom' }
  assert.deepEqual(validateGiftForm(form, now), {})
})

test('phone and email validation', () => {
  assert.ok(validateGiftForm({ ...validPersonal(), recipientPhone: '1234567' }, now).recipientPhone)
  assert.ok(validateGiftForm({ ...validPersonal(), recipientPhone: '5123 4567' }, now).recipientPhone)
  assert.ok(validateGiftForm({ ...validPersonal(), recipientEmail: 'nope' }, now).recipientEmail)
  assert.equal(normalizePhone('+65 9123-4567'), '91234567')
})

test('payload omits hidden sections', () => {
  const personal = buildGiftPayload(validPersonal(), brand)
  assert.equal(personal.sender, undefined)
  assert.equal(personal.recipient.phone, '+6591234567')
  assert.equal(personal.amount, 10)

  const gift = buildGiftPayload({ ...validGift(), deliveryTime: 'custom', deliveryDate: '2026-10-10' }, brand)
  assert.equal(gift.sender.name, 'Tuan Pham')
  assert.equal(gift.period, 'morning')
  assert.equal(gift.deliveryDate, '2026-10-10')
  assert.equal(buildGiftPayload(validGift(), brand).deliveryDate, undefined)
})

test('today string uses local date', () => {
  assert.equal(getTodayString(now), '2026-10-08')
})

test('pagination helpers', () => {
  assert.deepEqual(getResultRange(11, 10, 198), { from: 101, to: 110 })
  assert.deepEqual(getResultRange(10, 20, 198), { from: 181, to: 198 })
  assert.deepEqual(buildPageItems(1, 5), [1, 2, 3, 4, 5])
  assert.deepEqual(buildPageItems(1, 10), [1, 2, 3, 4, 5, '...', 10])
  assert.deepEqual(buildPageItems(5, 10), [1, '...', 4, 5, 6, '...', 10])
  assert.deepEqual(buildPageItems(10, 10), [1, '...', 6, 7, 8, 9, 10])
  assert.deepEqual(buildPageItems(4, 10), [1, 2, 3, 4, 5, '...', 10])
  assert.deepEqual(parseListQuery({ page: 'x', limit: '7' }), { page: 1, limit: 20 })
  assert.deepEqual(parseListQuery({ page: '3', limit: '10' }), { page: 3, limit: 10 })
})
