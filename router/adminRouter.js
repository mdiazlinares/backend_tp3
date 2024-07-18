const express = require('express');
const {
	crearProducto,
	listaProductos,
	editarProducto,
	eliminarProducto,
	listaUsuarios,
	editarUsuario,
	crearCancha,
	listaCanchas,
	editarCancha,
} = require('../controllers/adminControllers');
const { validarJWT } = require('../middleware/validarJWT');
const routerAdmin = express.Router();

routerAdmin.post('/crearProducto', crearProducto);  /*FALTA AGREGAR validarJWT*/

routerAdmin.get('/productos', listaProductos);  /*FALTA AGREGAR validarJWT*/

routerAdmin.put('/editarProducto', editarProducto);  /*FALTA AGREGAR validarJWT*/

routerAdmin.delete('/eliminar/:id', validarJWT, eliminarProducto);

routerAdmin.get('/usuarios', listaUsuarios); /*FALTA AGREGAR validarJWT*/

routerAdmin.put('/editarUsuario', editarUsuario); /*FALTA AGREGAR validarJWT*/

routerAdmin.post('/crearCancha', crearCancha); /*FALTA AGREGAR validarJWT*/

routerAdmin.get('/canchas', listaCanchas); /*FALTA AGREGAR validarJWT*/

routerAdmin.put('/editarCancha', editarCancha);

module.exports = routerAdmin;
