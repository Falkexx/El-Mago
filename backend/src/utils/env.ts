import 'dotenv/config';

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
});

export const env = envSchema.parse(process.env);
