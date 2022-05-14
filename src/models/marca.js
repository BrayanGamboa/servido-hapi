const Joi = require('joi')


const marcaSchemmaEdit = Joi.object({
    descripcion: Joi.string().required(),
    estado: Joi.string().max(1).required()
})



module.exports = marcaSchemmaEdit