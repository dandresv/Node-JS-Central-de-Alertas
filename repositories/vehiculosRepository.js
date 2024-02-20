function guardarDatosPeriodicos(messageId,tipoVehiculo, placa, datos) {
    //console.log(`Guardando datos periódicos para ${tipoVehiculo} con placa ${placa}:`, datos);
    // Aquí puedes implementar la lógica para guardar los datos en una base de datos
}

function guardarDatosPanico(messageId,tipoVehiculo, placa, datos) {
    //console.log(`Guardando datos de pánico para ${tipoVehiculo} con placa ${placa}:`, datos);
    // Aquí puedes implementar la lógica para guardar los datos de pánico en una base de datos
}

module.exports = {
    guardarDatosPeriodicos,
    guardarDatosPanico
};
