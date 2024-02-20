const cargaAnalisis = require('../controllers/cargaAnalisisController');

vehiculos = [
    {
        numeroPlaca: "ABC123",
        pesoInicial: 1000,
        temperaturaInicial: 20,
        deteccionesPlaneadas: [
            { latitud: 1.2345, longitud: -5.6789 },
            { latitud: 1.2346, longitud: -5.6790 },
            { latitud: 1.2347, longitud: -5.6791 }
        ]
    },
    {
        numeroPlaca: "XYZ456",
        pesoInicial: 1200,
        temperaturaInicial: 25,
        deteccionesPlaneadas: [
            { latitud: 2.3456, longitud: -6.7891 },
            { latitud: 2.3457, longitud: -6.7892 },
            { latitud: 2.3458, longitud: -6.7893 }
        ]
    },
    {
        numeroPlaca: "DEF789",
        pesoInicial: 950,
        temperaturaInicial: 18,
        deteccionesPlaneadas: [
            { latitud: 3.4567, longitud: -7.8901 },
            { latitud: 3.4568, longitud: -7.8902 },
            { latitud: 3.4569, longitud: -7.8903 }
        ]
    },
    {
        numeroPlaca: "GHI012",
        pesoInicial: 1100,
        temperaturaInicial: 22,
        deteccionesPlaneadas: [
            { latitud: 4.5678, longitud: -8.9012 },
            { latitud: 4.5679, longitud: -8.9013 },
            { latitud: 4.5680, longitud: -8.9014 }
        ]
    },
    {
        numeroPlaca: "JKL345",
        pesoInicial: 1050,
        temperaturaInicial: 21,
        deteccionesPlaneadas: [
            { latitud: 5.6789, longitud: -9.0123 },
            { latitud: 5.6790, longitud: -9.0124 },
            { latitud: 5.6791, longitud: -9.0125 }
        ]
    },
    {
        numeroPlaca: "MNO678",
        pesoInicial: 1300,
        temperaturaInicial: 26,
        deteccionesPlaneadas: [
            { latitud: 6.7890, longitud: -10.1234 },
            { latitud: 6.7891, longitud: -10.1235 },
            { latitud: 6.7892, longitud: -10.1236 }
        ]
    },
    {
        numeroPlaca: "PQR901",
        pesoInicial: 980,
        temperaturaInicial: 19,
        deteccionesPlaneadas: [
            { latitud: 7.8901, longitud: -11.2345 },
            { latitud: 7.8902, longitud: -11.2346 },
            { latitud: 7.8903, longitud: -11.2347 }
        ]
    },
    {
        numeroPlaca: "STU234",
        pesoInicial: 1150,
        temperaturaInicial: 23,
        deteccionesPlaneadas: [
            { latitud: 8.9012, longitud: -12.3456 },
            { latitud: 8.9013, longitud: -12.3457 },
            { latitud: 8.9014, longitud: -12.3458 }
        ]
    },
    {
        numeroPlaca: "VWX567",
        pesoInicial: 1250,
        temperaturaInicial: 24,
        deteccionesPlaneadas: [
            { latitud: 9.0123, longitud: -13.4567 },
            { latitud: 9.0124, longitud: -13.4568 },
            { latitud: 9.0125, longitud: -13.4569 }
        ]
    },
    {
        numeroPlaca: "YZA890",
        pesoInicial: 1020,
        temperaturaInicial: 20,
        deteccionesPlaneadas: [
            { latitud: 10.1234, longitud: -14.5678 },
            { latitud: 10.1235, longitud: -14.5679 },
            { latitud: 10.1236, longitud: -14.5680 }
        ]
    }
];

function analizarDatos(tipoVehiculo, placa, datos) {
    let alertas = [];

    // Regla 1: Si la temperatura del motor supera un umbral crítico durante un período prolongado
    alertas.push(estadoTemperatura(datos.carga.temperatura));

    // Regla 2: Si la presión de uno o más neumáticos está por debajo o por encima del rango aceptable
    alertas.push(presionNeumaticos(datos.presion_neumaticos));

    // Regla 3: Alertar si la carga de la batería cae por debajo de un nivel crítico
    alertas.push(estadoBateria(datos.estado_bateria))

    // Regla 4: Alertar si el nivel de combustible está por debajo de un nivel crítico
    alertas.push(estadoCombustible(datos.nivel_combustible))

    // Regla 5: Determinar si hay una detección no planeada basado en la latitud y longitud, radio menor a 10 kms
    // Coordenadas predefinidas
    alertas.push(deteccionNoPlaneada(placa, datos));

    //Regla 6: Determinar si hay daño o no el motor
    alertas.push(DanoMotor(datos.motor.nivel_aceite, datos.motor.temperatura_motor, datos.motor.nivel_agua_radiador, datos.motor.presion_aceite))

    //Validar si el tipo_vehiculo es de carga
    if (tipoVehiculo === "carga")
        alertas.push(cargaAnalisis.analizarDatosCarga(tipoVehiculo, placa, datos, vehiculos));

    return alertas;
}

// Función para validar si hay una detección no planeada
function deteccionNoPlaneada(placa, datos) {
    
    const vehiculoEncontrado = vehiculos.find(vehiculo => vehiculo.numeroPlaca === placa);
    
    if (!vehiculoEncontrado) {
        return "No se encontró el número de placa.";
    }
    
    const distanciaLimite = 10; // Distancia límite en km para considerar una detección no planeada
    
    for (const coordenada of vehiculoEncontrado.deteccionesPlaneadas) {
        const distancia = calcularDistancia(datos.localizacion.latitud, datos.localizacion.longitud, coordenada.latitud, coordenada.longitud);
        if (distancia <= distanciaLimite) {
            if (!datos.encendido) {
                return "Se ha detectado una detención planeada y el vehículo está apagado.";
            } else if (datos.velocidad < 1 && datos.rpm_motor < 1000) {
                return "Se ha detectado una detención planeada y el vehículo está encendido.";
            }
        }
        else {
            if (!datos.encendido) {
                return "Se ha detectado una detención no planeada y el vehículo está apagado.";
            } else if (datos.velocidad < 1 && datos.rpm_motor < 1000) {
                return "Se ha detectado una detención no planeada y el vehículo está encendido.";
            }
        }
    }   
}

// Función para calcular la distancia en kilómetros entre dos puntos geográficos
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * Math.PI / 180; // Diferencia de latitud en radianes
    const dLon = (lon2 - lon1) * Math.PI / 180; // Diferencia de longitud en radianes
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; // Distancia en kilómetros
    return distancia;
}

// Función para determinar si hay daño en el motor
function DanoMotor(nivelAceite, temperaturaMotor, nivelAguaRadiador, presionAceite) {
    let alertas = [];

    if (nivelAceite < 20) {
        alertas.push("Nivel de aceite bajo: Posible fuga de aceite o consumo excesivo de aceite.");
    } else if (nivelAceite <= 80) {
        //alertas.push("Nivel de aceite normal");
    } else {
        alertas.push("Nivel de aceite alto: Posible exceso de llenado o contaminación de aceite.");
    }
    

    if (temperaturaMotor < 60) {
        alertas.push("Temperatura del motor baja: posible termostato defectuoso.");
    } else if (temperaturaMotor <= 89) {
        //alertas.push("Temperatura del motor normal");
    } else {
        alertas.push("Temperatura del motor alta: posible problema de refrigeración.");
    }
    

    if (nivelAguaRadiador < 20) {
        alertas.push("Nivel de agua en el radiador bajo: posible fuga en el sistema.");
    } else if (nivelAguaRadiador <= 80) {
        //alertas.push("Nivel de agua en el radiador normal");
    } else {
        alertas.push("Nivel de agua en el radiador alto: posible exceso de llenado o contaminación.");
    }
    

    if (presionAceite < 20) {
        alertas.push("Presión del aceite baja: posible problema en la bomba de aceite.");
    } else if (presionAceite <= 80) {
        //alertas.push("Presión del aceite normal");
    } else {
        alertas.push("Presión del aceite alta: posible obstrucción en el sistema de lubricación.");
    }
    
    switch (alertas.length) {
        case 0:
            alertas.push("El motor está funcionando correctamente.");
            return alertas;
        case 1:
            alertas.push("El motor está fallando. Se ha detectado 1 alerta.");
            return alertas;
        case 2:
            alertas.push("El motor está fallando. Se han detectado 2 alertas.");
            return alertas;
        case 3:
            alertas.push("El motor está fallando. Se han detectado 3 alertas.");
            return alertas;
        default:
            alertas.push("El motor está fallando. Se han detectado múltiples alertas.");
            return alertas;
    }
}

// Función para determinar el estado del combustible
function estadoCombustible(nivel_combustible) {
    const nivelCriticoCombustible = 20; // Nivel crítico de combustible en %
    
    return nivel_combustible < nivelCriticoCombustible
        ? "El nivel de combustible ha caído por debajo del nivel crítico."
        : "El nivel de combustible está normal.";
}

// Función para determinar el estado de la bateria
function estadoBateria(estado_bateria) {
    const nivelCriticoBateria = 20; // Nivel crítico de carga de la batería en %
    if (estado_bateria < nivelCriticoBateria) {
        return "La carga de la batería ha caído por debajo del nivel crítico.";
    } else
        return "la carga de la bateria esta en estado normal."

}

// Función para determinar el estado de la temperatura
function estadoTemperatura(temperatura_carga) {
    const temperaturaCritica = 90; // Umbral crítico de temperatura en grados Celsius
    const periodoProlongado = 1; // Período prolongado en minutos
    
    if (temperatura_carga <= temperaturaCritica) {
        return "La temperatura del motor se encuentra en un estado normal.";
    }

    const ahora = new Date();
    const tiempoExcedido = (ahora - (new Date("2024-02-15T19:50:44.284Z"))) / (1000 * 60); // Convertir a minutos
    const excedido = tiempoExcedido >= periodoProlongado;

    return excedido
        ? "La temperatura del motor ha superado el umbral crítico durante un período prolongado."
        : "La temperatura del motor ha superado el umbral crítico, pero no durante un período prolongado.";
}

// Función para determinar el estado de los neumaticos
function presionNeumaticos(presion_neumaticos) {
    const mensajeDelanteros = validarPresionNeumatico(presion_neumaticos.delanteros, "delanteros");
    const mensajeTraseros = validarPresionNeumatico(presion_neumaticos.traseros, "traseros");

    return `${mensajeDelanteros}\n${mensajeTraseros}`;
}

function validarPresionNeumatico(presion, tipo) {
    const presionMinima = 25; // Presión mínima aceptable en PSI
    const presionMaxima = 35; // Presión máxima aceptable en PSI
    
    if (presion < presionMinima || presion > presionMaxima) {
        return `La presión de los neumáticos ${tipo} está fuera del rango aceptable.`;
    }
    
    return `La presión de los neumáticos ${tipo} está normal.`;
}

module.exports = {
    analizarDatos
};