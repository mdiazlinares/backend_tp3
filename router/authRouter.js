const express = require('express');
const { crearUsuario, loginUsuario, crearReserva, listaReservas, eliminarReserva, editarReserva } = require('../controllers/authControllers');
const { validarJWT } = require('../middleware/validarJWT');
const routerAuth = express.Router();

routerAuth.post('/login',  loginUsuario);

routerAuth.post('/registro', crearUsuario);

routerAuth.post('/reservarCancha', validarJWT, crearReserva);

routerAuth.get('/reservas', validarJWT, listaReservas);

routerAuth.delete('/eliminarReserva/:id', validarJWT, eliminarReserva);

routerAuth.put('/editarReserva/', validarJWT, editarReserva);

module.exports = routerAuth;
