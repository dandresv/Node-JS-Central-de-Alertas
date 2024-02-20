const vehiculosService = require('../services/vehiculosService');

function enviarDatosPeriodicos(req, res) {
    try {
        const {
            messageId,
            tipo_vehiculo,
            placa,
            datos
        } = req.body;

        res.status(200).json(vehiculosService.procesarDatosPeriodicos(messageId, tipo_vehiculo, placa, datos));
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

function enviarDatosPanico(req, res) {
    try {
        const {
            messageId,
            tipo_vehiculo,
            placa,
            datos
        } = req.body;
        res.status(200).json(vehiculosService.procesarDatosPanico(messageId, tipo_vehiculo, placa, datos));
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

}

module.exports = {
    enviarDatosPeriodicos,
    enviarDatosPanico
};