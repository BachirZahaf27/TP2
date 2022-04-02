const Joi = require('joi');

const taskSchema = {
    name: Joi.string().min(3).required(),
    website: Joi.string().required(),
    address: Joi.string().required(),
    base: Joi.string().required(),
};

exports.validateTask = (task) => Joi.validate(task, taskSchema);
