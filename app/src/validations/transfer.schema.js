import Joi from "joi";

const transferSchema = Joi.object({
  emailTo: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": " ",
      "string.email": "Enter a valid email address",
    }),
  fromEmail: Joi.string()
    .email({ tlds: { allow: false } })
    .optional() // Only validate if present
    .messages({
      "string.empty": " ",
      "string.email": "Enter a valid email address",
    }),
  title: Joi.string().required().messages({
    "string.empty": " ",
  }),
  message: Joi.string().required().messages({
    "string.empty": " ",
  }),
  files: Joi.any().optional(),
});

export { transferSchema };
