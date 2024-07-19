const express = require('express');
const {
	crearProducto,
	listaProductos,
	editarProducto,
	eliminarProducto,
	listaUsuarios,
	editarUsuario,
	eliminarUsuario,
	crearCancha,
	listaCanchas,
	editarCancha,
	eliminarCancha,
} = require('../controllers/adminControllers');
const { validarJWT } = require('../middleware/validarJWT');
const routerAdmin = express.Router();

routerAdmin.post('/crearProducto', validarJWT, crearProducto);  

routerAdmin.get('/productos', validarJWT, listaProductos);

routerAdmin.put('/editarProducto', validarJWT, editarProducto); 

routerAdmin.delete('/eliminarProducto/:id', validarJWT, eliminarProducto);	

routerAdmin.get('/usuarios', validarJWT, listaUsuarios); 

routerAdmin.put('/editarUsuario', validarJWT, editarUsuario); 

routerAdmin.delete('/eliminarUsuario/:id', validarJWT, eliminarUsuario);

routerAdmin.post('/crearCancha', validarJWT, crearCancha);

routerAdmin.get('/canchas', validarJWT, listaCanchas);

routerAdmin.put('/editarCancha', validarJWT, editarCancha);

routerAdmin.delete('/eliminarCancha/:id', validarJWT, eliminarCancha); 

module.exports = routerAdmin;
