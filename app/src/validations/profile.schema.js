import Joi from "joi";

const profileSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.empty": " ",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must not exceed 30 characters",
  }),
  password: Joi.string().allow(""),
});

export { profileSchema };
