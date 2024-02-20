function analizarDatosCarga(tipoVehiculo, placa, datos, vehiculos) {
    let alertasCarga = [];

    setTimeout(() => {
        // Función para validar el cambio de peso y temperatura de una carga

        // Buscar la carga inicial correspondiente al número de placa
        const cargaInicial = vehiculos.find(carga => carga.numeroPlaca === placa);

        if (!cargaInicial) {
            // No se encontró la carga inicial, no se puede realizar la validación
            return "No se encontró la carga inicial para el número de placa.";
        }

        // Validación del cambio de peso
        const cambioPeso = datos.carga.peso_actual - cargaInicial.pesoInicial;
        if (Math.abs(cambioPeso) > 15) {
            return "El cambio de peso de la carga excede los 15 kilogramos.";
        }

        // Validación del cambio de temperatura
        const cambioTemperatura = datos.carga.temperatura - cargaInicial.temperaturaInicial;
        if (cambioTemperatura < -10 || cambioTemperatura > 10) {
            return "El cambio de temperatura de la carga excede los 10 grados Celsius.";
        }

        // La carga cumple con las condiciones
        // La carga cumple con las condiciones
        return "La carga cumple con las condiciones de peso y temperatura.";
    }, 20); // Retraso de 15 ms
}

module.exports = {
    analizarDatosCarga
};


module.exports = {
    analizarDatosCarga
};