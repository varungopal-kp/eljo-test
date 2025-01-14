import Joi from "joi";

const signupSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.empty": " ",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must not exceed 30 characters",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": " ",
      "string.email": "Enter a valid email address",
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": " ",
    "string.min": "Password must be at least 6 characters",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
    "string.empty": " ",
  }),
});

const signinSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": " ",
      "string.email": "Enter a valid email address",
    }),
  password: Joi.string().required().messages({
    "string.empty": " ",
  }),
});

export { signupSchema ,signinSchema};
