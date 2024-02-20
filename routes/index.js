const express = require('express');
const vehiculosController = require('../controllers/vehiculosController');
const analisisController = require('../controllers/analisisController');

const router = express.Router();

// Rutas para vehículos
router.post('/api/vehiculos/datos-periodicos', vehiculosController.enviarDatosPeriodicos);
router.post('/api/vehiculos/datos-panico', vehiculosController.enviarDatosPanico);

module.exports = router;
