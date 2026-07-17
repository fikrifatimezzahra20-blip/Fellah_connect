'use strict';

/**
 * Express middleware factory for Zod schema validation.
 *
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against.
 * @param {'body'|'params'|'query'} source - Which part of the request to validate.
 * @returns {Function} Express middleware
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        message: 'Donnees invalides.',
        details: result.error.issues.map(
          (i) => `${i.path.join('.')}: ${i.message}`
        ),
      });
    }

    // Replace with parsed (coerced / defaulted) values
    req[source] = result.data;
    return next();
  };
}

module.exports = { validate };
