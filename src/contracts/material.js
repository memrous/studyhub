/**
 * src/contracts/material.js
 *
 * API contract for the Material (learning resource) entity.
 *
 * This JSDoc typedef is the single source of truth for the Material shape
 * shared between the React frontend and the future Laravel backend.
 *
 * Laravel endpoint (planned):
 *   GET  /api/materials      → Material[]
 *   POST /api/materials      → Material
 *   DEL  /api/materials/:id  → void
 */

/**
 * @typedef {'PDF'|'Link'|'Video'|'Note'|'Image'|'Other'} MaterialType
 */

/**
 * @typedef {Object} Material
 * @property {number}       id          - Unique identifier
 * @property {number}       subjectId   - FK → Subject.id
 * @property {string}       title       - Display name of the resource
 * @property {MaterialType} type        - File or resource category
 * @property {string}       [url]       - External URL or file path
 * @property {string}       [content]   - Inline text content (for notes)
 * @property {string}       [uploadedAt]- ISO datetime string
 */

export {} // keeps this a proper ES module
