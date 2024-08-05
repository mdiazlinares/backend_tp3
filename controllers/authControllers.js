const usuarioModel = require('../model/usuario-model');
const reservaModel = require('../model/reservas-model');

const comprasModel = require('../model/compras-model');
const productoModel = require('../model/producto-model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const crearUsuario = async (req, res) => {
	try {
		//atravez de req.body recibimos en un objeto lo que nos envio el "FRONT"
		const { name, edad, email, password } = req.body;

		//validaciones
		if (name === '' || edad === '' || email === '' || password === '') {
			res.status(400).json({
				msg: 'Todos los campos son obligatorios',
			});
		}

		//analizamos si el correo ingresado no esta registrado
		let usuario = await usuarioModel.findOne({ email });
		if (usuario) {
			return res.status(400).json({
				mensaje: 'El usuario ya existe',
			});
		}

		//en el caso que no exista el correo en la base de datos, creamos una instancia
		usuario = new usuarioModel(req.body);

		//encriptamos password
		const salt = bcrypt.genSaltSync(10);
		usuario.password = bcrypt.hashSync(password, salt);

		//guardarlo en la base de datos
		await usuario.save();

		res.status(201).json({
			msg: 'Usuario creado',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: 'Por favor contactarse con un administrador',
		});
	}
};

const loginUsuario = async (req, res) => {
	try {
		const { email, password} = req.body;

		//validaciones
		if (email === '' || password === '') {
			res.status(400).json({
				msg: 'Todos los campos son obligatorios',
			});
		}

		//Analizamos si el correo ingresado no esta registrado
		let usuario = await usuarioModel.findOne({ email });
		if (!usuario) {
			return res.status(400).json({
				mensaje: 'El email no existe',
			});
		}

		//validar password, vamos a comparar la contraseña del correo que encontre con la que ingreso el USUARIO
		const validarPassword = bcrypt.compareSync(password, usuario.password);
		if (!validarPassword) {
			res.status(400).json({
				msg: 'La contraseña es incorrecta',
			});
		}

		//creamos un objeto el cual definimos los datos que queremos guardar en el token
		const payload = {
			name: usuario.name,
			rol: usuario.rol,
			id_usuario: usuario.id
		};

		const token = jwt.sign(payload, process.env.SECRET_JWT, {expiresIn: '24h',});

		res.status(200).json({
			msg: 'Usuario logueado',
			token,			
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Por favor contactarse con un administrador',
		});
	}
};

const crearReserva = async (req, res) => {
    try {
        const { id_cancha, id_usuario, fecha, horaInicio, horaFin } = req.body;

		//validaciones
		if (id_cancha === '' || id_usuario === '' || fecha === '' || horaInicio === '' || horaFin === '') {
			res.status(400).json({
				msg: 'Todos los campos son obligatorios',
			});
		}
		//Analizamos que las horas ingresadas sean correctas
        if (horaInicio < 1 || horaInicio >= 24) {
            return res.status(400).json({ message: 'La hora de fin debe ser mayor que 1 y menor o igual que 24.' });
        }

        // Validación de horaFin
        if (horaFin <= 1 || horaFin > 24) {
            return res.status(400).json({ message: 'La hora de fin debe ser mayor que 1 y menor o igual que 24.' });
        }

        if (horaInicio >= horaFin) {
            return res.status(400).json({ message: 'La hora de inicio debe ser menor que la hora de fin.' });
        }

        // Verificar disponibilidad
        const reservasExistentes = await reservaModel.find({
            id_cancha,
            fecha,
            $or: [
                { horaInicio: { $lt: horaFin, $gte: horaInicio } },
                { horaFin: { $gt: horaInicio, $lte: horaFin } },
                { horaInicio: { $lt: horaInicio }, horaFin: { $gt: horaFin } }
            ]
        });

        if (reservasExistentes.length > 0) {
            return res.status(400).json({ message: 'La cancha ya está reservada para ese horario.' });
        }

        const nuevaReserva = new reservaModel({ id_cancha, id_usuario, fecha, horaInicio, horaFin });
        await nuevaReserva.save();
        
        res.status(201).json(nuevaReserva);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la reserva.' });
    }
};

const listaReservas = async (req, res) => {
	try {
		//Si al metodo find no le asignamos ningun argumento, me retornara el arreglo con todos los elementos del modelo
		const listaReservas = await reservaModel.find();
		if (!listaReservas) {
			return res.status(400).json({
				mensaje: 'No existen reservas cargadas para listar',
			});
		}

		res.status(200).json({
			msg: 'Lista de reservas generadas',
			//le envio al front toda la lista de productos
			listaReservas,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error, por favor contactarse con un administrador',
		});
	}
};

const eliminarReserva = async (req, res) => {
	try {
		//recibimos por PARAMETRO el id de la reserva que queremos eliminar y lo comparamos con todos los id de la base de datos del modelo producto
		const reservaEliminar = await reservaModel.findById(req.params.id);

		//en caso de que el que queramos eliminar no se encuetre prevenimos el error comunicandoselo
		if (!reservaEliminar) {
			return res.status(400).json({
				msg: 'No existe ninguna reserva con este ID',
			});
		}

		await reservaModel.findByIdAndDelete(req.params.id);

		res.status(200).json({
			msg: 'Reserva eliminada',
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error, por favor contactarse con un administrador',
		});
	}
};

const editarReserva = async (req, res) => {
	try {
		//buscamos que el usuario que quiera editar exista
		const reservaEditar = await reservaModel.findById(req.body._id);

		//en caso de no existir tiramos un error
		if (!reservaEditar) {
			return res.status(400).json({
				msg: 'No existe una reserva con este ID',
			});
		}

		await reservaModel.findByIdAndUpdate(req.body._id, req.body);

		res.status(200).json({
			msg: 'Reserva editada exitosamente',
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error, por favor contactarse con un administrador',
		});
	}
};

const registrarCompra = async (req, res) => {
    try {
        const { usuario, productos } = req.body;

		//Validaciones
		if (usuario === '' || productos === '' ) {
			res.status(400).json({
				msg: 'Todos los campos son obligatorios',
			});
		}

        // Calcular el total y verificar stock
        let total = 0;
        for (const item of productos) {
            const producto = await productoModel.findById(item.producto);
            if (!producto || producto.stock < item.cantidad) {
                return res.status(400).json({ message: `Stock insuficiente para el producto: ${producto ? producto.name : 'desconocido'}` });
            }
            total += producto.precio * item.cantidad;
        }

        // Registrar la compra
        const nuevaCompra = new comprasModel({ usuario, productos, total });
        await nuevaCompra.save();

        // Actualizar el stock de los productos
        for (const item of productos) {
            await productoModel.findByIdAndUpdate(item.producto, { $inc: { stock: -item.cantidad } });
        }

        res.status(201).json({ message: 'Compra registrada exitosamente', compra: nuevaCompra });
    } catch (error) {
        console.error('Error al registrar la compra:', error);
        res.status(500).json({ message: 'Error al registrar la compra, por favor contactarse con un administrador' });
    }
};

const listarComprasPorUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params;

		//Validaciones
		if (idUsuario === '') {
			res.status(400).json({
				msg: 'El idUsuario es obligatorio',
			});
		}

        // Buscar las compras del usuario, recuperando también los nombres del producto y del usuario
        const compras = await comprasModel.find({ usuario: idUsuario })
            .populate('usuario', 'name')
            .populate('productos.producto', 'name');

        // Si no se encuentran compras
        if (compras.length === 0) {
            return res.status(404).json({
                msg: 'No se encontraron compras para este usuario',
            });
        }

        // Responder con la lista de compras
        res.status(200).json({
            msg: 'Compras del usuario',
            compras,
        });
    } catch (error) {
        console.error('Error al listar las compras:', error);
        res.status(500).json({
            msg: 'Error al listar las compras, por favor contactarse con un administrador',
        });
    }
};

module.exports = { crearUsuario, loginUsuario, crearReserva, listaReservas, eliminarReserva, editarReserva, registrarCompra, listarComprasPorUsuario };
