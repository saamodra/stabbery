import Joi from 'joi';

const mockSchema = Joi.object({
  path: Joi.string().required().pattern(/^\//).message('Path must start with /'),
  method: Joi.string().required().valid('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'),
  request_headers: Joi.object().default({}),
  request_body_schema: Joi.object().default({}),
  response_status: Joi.number().integer().min(100).max(599).default(200),
  response_headers: Joi.object().default({}),
  response_body: Joi.alternatives().try(
    Joi.object(),
    Joi.array(),
    Joi.string(),
    Joi.number(),
    Joi.boolean()
  ).default({})
});

export const validateMockData = (data) => {
  return mockSchema.validate(data, { abortEarly: false });
};