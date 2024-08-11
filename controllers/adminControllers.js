const productoModel = require('../model/producto-model');
const usuarioModel = require('../model/usuario-model');
const canchaModel = require('../model/cancha-model');

const crearProducto = async (req, res) => {
	try {
		const { nombre_producto, precio, descripcion, imagen } = req.body;

		//validaciones
		if (nombre_producto === '' || precio === '' || descripcion === '' || imagen === '') {
			res.status(400).json({
				msg: 'Todos los campos son obligatorios',
			});
		}

		const productoExistente = await productoModel.findOne({ nombre_producto });
        if (productoExistente) {
            return res.status(400).json({ msg: 'El producto ya existe' });
        }		
		//fin de las validaciones

		const producto = new productoModel(req.body);

		//guardarlo en la base de datos
		await producto.save();

		res.status(201).json({
			msg: 'Producto creado',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: 'Error, por favor contactarse con un administrador',
		});
	}
};

const listaProductos = async (req, res) => {
	try {
		const listaProductos = await productoModel.find();

		res.status(200).json({
			msg: 'lista de productos enviadas',
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
		const { _id, nombre_producto, precio, descripcion, stock, estado, imagen } = req.body;

		//validaciones
		if (!_id || !nombre_producto || !precio || !descripcion || !stock || !estado) {
            return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
        }

        const productoEditar = await productoModel.findById(_id);
        if (!productoEditar) {
            return res.status(400).json({ msg: 'No existe un producto con este ID' });
        }

		const productoExistente = await productoModel.findOne({ nombre_producto });
        if (productoExistente) {
            return res.status(400).json({ msg: 'El producto ya existe' });
        }	
		//fin de las validaciones

		const productoActualizado = await productoModel.findByIdAndUpdate(_id, req.body, { new: true });
        res.status(200).json({ 
			msg: 'Producto editado exitosamente', productoActualizado 
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

		if (!productoEliminar) {
			return res.status(400).json({
				msg: 'No existe ningun producto con este ID',
			});
		}

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

		res.status(200).json({
			msg: 'Lista de usuarios enviadas',
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
		const { nombre_usuario, edad, email, password, estado } = req.body;
		// validaciones
		if (nombre_usuario === '' || edad === '' || email === ''|| password === '') {
			res.status(400).json({
				msg: 'Todos los campos son obligatorios',
			});
		}

		//buscamos que el usuario que quiera editar exista
		const usuarioEditar = await usuarioModel.findById(req.body._id);

		//en caso de no existir tiramos un error
		if (!usuarioEditar) {
			return res.status(400).json({
				msg: 'No existe un usuario con este ID',
			});
		}

		const usuarioExistente = await usuarioModel.findOne({ nombre_usuario });
        if (usuarioExistente) {
            return res.status(400).json({ msg: 'Ya existe un usuario con la misma descripción' });
        }		
		// fin de las validaciones

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
	
const crearCancha = async (req, res) => {
	try {
		const { nombre_cancha, descripcion, estado, imagen, cesped, tamanio, precio } = req.body;

		// validaciones
		if (nombre_cancha === '' || descripcion === '' || estado === '' || imagen === '' || cesped === '' || tamanio === '' || precio === '') {
			res.status(400).json({
				msg: 'Todos los campos son obligatorios',
			});
		}
		// fin de las validaciones

		const cancha = new canchaModel(req.body);

		//guardarlo en la base de datos
		await cancha.save();

		res.status(201).json({
			msg: 'Cancha creada',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: 'Error, por favor contactarse con un administrador',
		});
	}
};

const listaCanchas = async (req, res) => {
	try {
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
		//buscamos que la cancha que quiera editar exista
		const canchaEditar = await canchaModel.findById(req.body._id);

		//en caso de no existir tiramos un error
		if (!canchaEditar) {
			return res.status(400).json({
				msg: 'No existe una cancha con este ID',
			});
		}

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

//
const eliminarCancha = async (req, res) => {
	try {
		//recibimos por PARAMETRO el id de la cancha que queremos eliminar y lo comparamos con todos los id de la base de datos del modelo producto
		const canchaEliminar = await canchaModel.findById(req.params.id);

		//en caso de que el que queramos eliminar no se encuetre prevenimos el error comunicandoselo
		if (!canchaEliminar) {
			return res.status(400).json({
				msg: 'No existe ninguna cancha con este ID',
			});
		}

		await canchaModel.findByIdAndDelete(req.params.id);

		res.status(200).json({
			msg: 'Cancha eliminada',
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
	eliminarCancha
};
