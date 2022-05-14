const Joi = require('joi')

const userSchemmaNew = Joi.object({
    email: Joi.string().email().required(),
    nombre: Joi.string().required(),
    apellido: Joi.string().required(),
    rol: Joi.string().required()
})

const userSchemmaEdit = Joi.object({
    nombre: Joi.string().required(),
    apellido: Joi.string().required(),
    rol: Joi.string().required()
})



module.exports = userSchemmaEdit, userSchemmaNew