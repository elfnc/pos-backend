import Joi from 'joi';

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source]; 

    const { error } = schema.validate(dataToValidate, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      const err = new Error(errorMessage);
      err.status = 400;
      return next(err);
    }

    next();
  };
};

export default validate;