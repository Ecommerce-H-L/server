import type { ZodValidationPipe } from 'nestjs-zod';
import { createZodValidationPipe } from 'nestjs-zod';
import type { ZodError } from 'zod';

import { ValidationException } from '../exceptions';

export const CustomZodValidationPipe: typeof ZodValidationPipe =
  createZodValidationPipe({
    createValidationException: (error: unknown) => {
      const errors = error as ZodError<unknown>;
      return new ValidationException(
        'Validation failed',
        errors.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      );
    },
  });
