import * as Joi from 'joi';

export const envSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').optional(),
  DB_NAME: Joi.string().required(),
  ORIGIN: Joi.string().optional()
});