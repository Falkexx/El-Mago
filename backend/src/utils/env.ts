import 'dotenv/config';
import { STORAGE_PROVIDER } from 'src/@metadata';

import { z } from 'zod';

const envSchema = z.object({
  JWT_SECRET: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: 'POSTGRES_PORT must be a valid number',
    })
    .transform((val) => parseInt(val, 10)),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  // POSTGRES_SSL: z
  //   .string()
  //   .refine(
  //     (val) => val.toLowerCase() === 'true' || val.toLowerCase() === 'false',
  //     {
  //       message: "POSTGRES_SSL must be 'true' or 'false'",
  //     },
  //   )
  //   .transform((val) => val.toLowerCase() === 'true'),
  REDIS_HOST: z.string(),
  REDIS_PORT: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: 'POSTGRES_PORT must be a valid number',
    })
    .transform((val) => parseInt(val, 10)),
  REDIS_PASSWORD: z.string(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z
    .string()
    .regex(/^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{8,100}$/, {
      message:
        'A senha deve ter 8 carecteres, um especial um maúsculo e um número no mínimo',
    }),
  BACKEND_BASE_URL: z.string().url(),
  BACKEND_PORT: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: 'POSTGRES_PORT must be a valid number',
    })
    .transform((val) => parseInt(val, 10)),

  DATABASE_LOG: z
    .string()
    .optional()
    .refine(
      (val) => val.toLowerCase() === 'true' || val.toLowerCase() === 'false',
      {
        message: "DATABASE_LOG must be 'true' or 'false'",
      },
    )
    .transform((val) => val.toLowerCase() === 'true'),
  AWS_S3_ACCESS_KEY_ID: z.string(),
  AWS_S3_SECRET_ACCESS_KEY_ID: z.string(),
  STORAGE_PROVIDER: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine((val) => Object.values(STORAGE_PROVIDER).includes(val as any), {
      message: `O valor deve ser um dos seguintes: ${Object.values(STORAGE_PROVIDER).join(', ')}`,
    }),
});

export const env = envSchema.parse(process.env);
