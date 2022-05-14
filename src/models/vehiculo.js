const Joi = require('joi')


const vehiculoSchemmaNew = Joi.object({
    num_placa: Joi.string().max(6).required(),
    modelo: Joi.string().required(),
    fch_vence_seg: Joi.string().required(),
    fch_vence_tecno: Joi.string().required(),
    linea: Joi.number().max(20).required(),
    url_img: Joi.string().required()
})

const vehiculoSchemmaEdit = Joi.object({
    modelo: Joi.string().required(),
    fch_vence_seg: Joi.string().required(),
    fch_vence_tecno: Joi.string().required(),
    linea: Joi.number().max(20).required(),
    url_img: Joi.string().required()
})



module.exports = vehiculoSchemmaNew, {vehiculoSchemmaEdit}