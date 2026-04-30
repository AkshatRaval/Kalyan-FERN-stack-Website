// lib/formUtils.js
// ─────────────────────────────────────────────────────────────────────────────
// Shared utilities: grouping, validation, initial state.
// Pure functions — no React, no side effects. Safe to import on backend too.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Group an array of fields by their `section` key.
 * Preserves insertion order.
 * @param {Array} fields
 * @returns {Object} { sectionKey: [field, ...], ... }
 */
export function groupBySection(fields) {
  const out = {};
  for (const field of fields) {
    const key = field.section ?? 'other';
    if (!out[key]) out[key] = [];
    out[key].push(field);
  }
  return out;
}

/**
 * Build initial form values from a fields array.
 * Respects defaultValue; booleans default to false, everything else to ''.
 */
export function buildInitialValues(fields) {
  const values = {};
  for (const field of fields) {
    if (field.defaultValue !== undefined) {
      values[field.id] = field.defaultValue;
    } else if (field.type === 'checkbox') {
      values[field.id] = false;
    } else if (field.type === 'members') {
      values[field.id] = [];
    } else if (field.type === 'topic-picker') {
      values[field.id] = [];
    } else {
      values[field.id] = '';
    }
  }
  return values;
}

/**
 * Validate a single field value.
 * Returns null if valid, or an error string.
 */
export function validateField(field, value, allValues) {
  // Required check
  if (field.required) {
    const empty =
      value === '' ||
      value === null ||
      value === undefined ||
      value === false ||
      (Array.isArray(value) && value.length === 0);

    if (empty) return `${field.label} is required.`;
  }

  // Skip custom validation if value is empty and field is optional
  if (!value && !field.required) return null;

  // Custom validate function
  if (field.validate && value) {
    const result = field.validate(value, allValues);
    if (result !== true && result !== undefined) return result;
  }

  return null;
}

/**
 * Validate all fields in order.
 * Returns the first error string, or null if all valid.
 */
export function validateAll(fields, values) {
  for (const field of fields) {
    // Skip readOnly fields
    if (field.readOnly) continue;

    const error = validateField(field, values[field.id], values);
    if (error) return error;
  }
  return null;
}

/**
 * Human-readable section labels. Add new keys here as needed.
 */
export const SECTION_LABELS = {
  personal:  'Personal Information',
  team:      'Team Information',
  academic:  'Academic Information',
  guardian:  'Guardian Information',
  documents: 'Document Upload',
  topics:    'Select Your Domain / Category',
  extra:     'Additional Details',
  consent:   'Declaration & Consent',
};