const vehiculosRepository = require('../repositories/vehiculosRepository');
const analisisController = require('../controllers/analisisController');
const notificacionController = require('../controllers/notificacionController');

function procesarDatosPeriodicos(messageId,tipoVehiculo, placa, datos) {
    vehiculosRepository.guardarDatosPeriodicos(messageId,tipoVehiculo, placa, datos);
    return analisisController.analizarDatos(tipoVehiculo, placa, datos)
}

function procesarDatosPanico(messageId, tipo_vehiculo, placa, datos) {
    vehiculosRepository.guardarDatosPanico(messageId, tipo_vehiculo, placa, datos);
    return notificacionController.notificacionPanico(tipo_vehiculo, placa, datos)
}

module.exports = {
    procesarDatosPeriodicos,
    procesarDatosPanico
};
