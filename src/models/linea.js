const Joi = require('joi')


const lineaSchemmaEdit = Joi.object({
    descripcion: Joi.string().required(),
    estado: Joi.string().max(1).required(),
    // nombre_marca: Joi.string().required()
})



module.exports = lineaSchemmaEdit