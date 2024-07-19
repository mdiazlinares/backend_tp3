const productoModel = require('../model/producto-model');
const usuarioModel = require('../model/usuario-model');
const canchaModel = require('../model/cancha-model');
const jwt = require('jsonwebtoken');

const crearProducto = async (req, res) => {
	try {
		const { name, precio, descripcion } = req.body;

		//validaciones
		if (name === '' || precio === '' || descripcion === '') {
			res.status(400).json({
				msg: 'Todos los campos son obligatorios',
			});
		}
		//fin de las validaciones

		//opcional verificar si el producto existe o no y ver como lo encaran
		const producto = new productoModel(req.body);

		//guardarlo en la base de datos
		await producto.save();

		res.status(201).json({
			msg: 'Producto creado',
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error, por favor contactarse con un administrador',
		});
	}
};

const listaProductos = async (req, res) => {
	try {
		//Si al metodo find no le asignamos ningun argumento, me retornara el arreglo con todos los elementos del modelo
		const listaProductos = await productoModel.find();

		res.status(200).json({
			msg: 'lista de productos enviadas',
			//le envio al front toda la lista de productos
			listaProductos,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error, por favor contactarse con un administrador',
		});
	}
};

const editarProducto = async (req, res) => {
	try {
		//validaciones
		// if (name === '' || precio === '' || descripcion === '') {
		// 	res.status(400).json({
		// 		msg: 'Todos los campos son obligatorios',
		// 	});
		// }
		//fin de las validaciones

		//buscamos que el producto que quiera editar exista
		const productoEditar = await productoModel.findById(req.body._id);

		//en caso de no existir tiramos un error
		if (!productoEditar) {
			return res.status(400).json({
				msg: 'No existe un producto con este ID',
			});
		}

		//si el producto que quiere editar se encuentra buscamos por el id en toda la lista y remplazamos el valor encontrado por el valor que envio el usuario
		await productoModel.findByIdAndUpdate(req.body._id, req.body);

		res.status(200).json({
			msg: 'Producto editado exitosamente',
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error, por favor contactarse con un administrador',
		});
	}
};

const eliminarProducto = async (req, res) => {
	try {
		//recibimos por PARAMETRO el id del producto que queremos eliminar y lo comparamos con todos los id de la base de datos del modelo producto
		const productoEliminar = await productoModel.findById(req.params.id);

		//en caso de que el que queramos eliminar no se encuetre prevenimos el error comunicandoselo
		if (!productoEliminar) {
			return res.status(400).json({
				msg: 'No existe ningun producto con este ID',
			});
		}

		//en caso que el producto que quiera eliminar se encuentre buscamos por y el que coincida lo eliminar de la DB
		await productoModel.findByIdAndDelete(req.params.id);

		res.status(200).json({
			msg: 'Producto eliminado',
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error, por favor contactarse con un administrador',
		});
	}
};

const listaUsuarios = async (req, res) => {
	try {
		const listaUsuarios = await usuarioModel.find();
		if (!listaUsuarios) {
			return res.status(400).json({
				mensaje: 'No existen usuarios cargados para listar',
			});
		}
		// const payload = {mensaje:"payload",
		// };

		// const token = jwt.sign(payload, process.env.SECRET_JWT, {
		// 	expiresIn: '3h',
		// });

		res.status(200).json({
			msg: 'Lista de usuarios enviadas',
			//le envio al front toda la lista de usuarios
			listaUsuarios,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error, por favor contactarse con un administrador',
		});
	}
};


const editarUsuario = async (req, res) => {
	try {
		// const { name, edad, email, password, estado } = req.body;
		// validaciones
		// if (name === '' || edad === '' || email === ''|| password === '') {
		// 	res.status(400).json({
		// 		msg: 'Todos los campos son obligatorios',
		// 	});
		// }
		// fin de las validaciones

		//buscamos que el usuario que quiera editar exista
		const usuarioEditar = await usuarioModel.findById(req.body._id);

		//en caso de no existir tiramos un error
		if (!usuarioEditar) {
			return res.status(400).json({
				msg: 'No existe un usuario con este ID',
			});
		}

		//si el usuario que quiere editar se encuentra buscamos por el id en toda la lista y remplazamos el valor encontrado por el valor que envio el usuario
		await usuarioModel.findByIdAndUpdate(req.body._id, req.body);

		res.status(200).json({
			msg: 'Usuario editado exitosamente',
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error, por favor contactarse con un administrador',
		});
	}
};


const eliminarUsuario = async (req, res) => {
	try {
		//recibimos por PARAMETRO el id del usuario que queremos eliminar y lo comparamos con todos los id de la base de datos del modelo producto
		const usuarioEliminar = await usuarioModel.findById(req.params.id);

		//en caso de que el que queramos eliminar no se encuetre prevenimos el error comunicandoselo
		if (!usuarioEliminar) {
			return res.status(400).json({
				msg: 'No existe ningun usuario con este ID',
			});
		}

		//en caso que el usuario que quiera eliminar se encuentre buscamos por y el que coincida lo eliminar de la DB
		await usuarioModel.findByIdAndDelete(req.params.id);

		res.status(200).json({
			msg: 'Usuario eliminado',
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error, por favor contactarse con un administrador',
		});
	}
};
	
///////////////////////////

const crearCancha = async (req, res) => {
	try {
		// const { name, descripcion, estado } = req.body;

		//validaciones
		// if (name === '' || descripcion === '' || estado === '') {
		// 	res.status(400).json({
		// 		msg: 'Todos los campos son obligatorios',
		// 	});
		// }
		//fin de las validaciones

		//opcional verificar si la cancha existe o no y ver como lo encaran
		const cancha = new canchaModel(req.body);

		//guardarlo en la base de datos
		await cancha.save();

		res.status(201).json({
			msg: 'Cancha creada',
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error, por favor contactarse con un administrador',
		});
	}
};

const listaCanchas = async (req, res) => {
	try {
		//Si al metodo find no le asignamos ningun argumento, me retornara el arreglo con todos los elementos del modelo
		const listaCanchas = await canchaModel.find();

		res.status(200).json({
			msg: 'Lista de canchas enviadas',
			//le envio al front toda la lista de productos
			listaCanchas,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error, por favor contactarse con un administrador',
		});
	}
};

const editarCancha = async (req, res) => {
	try {
		//validaciones
		// if (name === '' || descripcion === '' || estado === '') {
		// 	res.status(400).json({
		// 		msg: 'Todos los campos son obligatorios',
		// 	});
		// }
		//fin de las validaciones

		//buscamos que la cancha que quiera editar exista
		const canchaEditar = await canchaModel.findById(req.body._id);

		//en caso de no existir tiramos un error
		if (!canchaEditar) {
			return res.status(400).json({
				msg: 'No existe una cancha con este ID',
			});
		}

		//si la cancha que quiere editar se encuentra buscamos por el id en toda la lista y remplazamos el valor encontrado por el valor que envio el usuario
		await canchaModel.findByIdAndUpdate(req.body._id, req.body);

		res.status(200).json({
			msg: 'Cancha editada exitosamente',
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error, por favor contactarse con un administrador',
		});
	}
};

module.exports = {
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
};
