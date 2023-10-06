import zod from 'zod';
import BaseError from './base-error';

export default class ValidationError extends BaseError {
  constructor(errors: zod.ZodError) {
    super({
      message: 'Request body could not be validated.',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      action: 'Please send the same request again with a valid request body.',
      additionalData: errors.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
    });
  }
}
