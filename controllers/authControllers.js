const canchaModel = require('../model/cancha-model');
const usuarioModel = require('../model/usuario-model');
const reservaModel = require('../model/reservas-model');
const comprasModel = require('../model/compras-model');
const productoModel = require('../model/producto-model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const crearUsuario = async (req, res) => {
	try {
		const { nombre_usuario, edad, email, password } = req.body;

		if (nombre_usuario === '' || edad === '' || email === '' || password === '') {
			res.status(400).json({
				msg: 'Todos los campos son obligatorios',
			});
		}

		let usuario = await usuarioModel.findOne({ email });
		if (usuario) {
			return res.status(400).json({
				mensaje: 'El usuario ya existe',
			});
		}

		usuario = new usuarioModel(req.body);

		const salt = bcrypt.genSaltSync(10);
		usuario.password = bcrypt.hashSync(password, salt);

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

		if (email === '' || password === '') {
			res.status(400).json({
				msg: 'Todos los campos son obligatorios',
			});
		}

		let usuario = await usuarioModel.findOne({ email });
		if (!usuario) {
			return res.status(400).json({
				mensaje: 'El email no existe',
			});
		}

		const validarPassword = bcrypt.compareSync(password, usuario.password);
		if (!validarPassword) {
			res.status(400).json({
				msg: 'La contraseña es incorrecta',
			});
		}

		const payload = {
			nombre_usuario: usuario.nombre_usuario,
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

		if (id_cancha === '' || id_usuario === '' || fecha === '' || horaInicio === '' || horaFin === '') {
			res.status(400).json({
				msg: 'Todos los campos son obligatorios',
			});
		}
		if (horaInicio < 1 || horaInicio >= 24) {
            return res.status(400).json({ message: 'La hora de fin debe ser mayor que 1 y menor o igual que 24.' });
        }

        if (horaFin <= 1 || horaFin > 24) {
            return res.status(400).json({ message: 'La hora de fin debe ser mayor que 1 y menor o igual que 24.' });
        }

        if (horaInicio >= horaFin) {
            return res.status(400).json({ message: 'La hora de inicio debe ser menor que la hora de fin.' });
        }

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
		let listaReservas = await reservaModel.find()
			.populate('id_cancha', 'nombre_cancha')
			.populate('id_usuario', 'nombre_usuario');

		if (!listaReservas || listaReservas.length === 0) {
			return res.status(400).json({
				mensaje: 'No existen reservas cargadas para listar',
			});
		}

		listaReservas = listaReservas.map(reserva => {
			return {
				...reserva._doc,
				fecha: new Date(reserva.fecha).toLocaleDateString('es-ES'), // Cambia el formato a dd/mm/yyyy
				nombre_cancha: reserva.id_cancha.nombre_cancha,
				nombre_usuario: reserva.id_usuario.nombre_usuario,
			};
		});

		res.status(200).json({
			msg: 'Lista de reservas generadas',
			listaReservas, // Enviamos la lista de reservas con las fechas formateadas y nombres poblados
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: 'Error, por favor contactarse con un administrador',
		});
	}
};



const eliminarReserva = async (req, res) => {
	try {
		const reservaEliminar = await reservaModel.findById(req.params.id);

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
		const reservaEditar = await reservaModel.findById(req.body._id);

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

		if (usuario === '' || productos === '' ) {
			res.status(400).json({
				msg: 'Todos los campos son obligatorios',
			});
		}

        let total = 0;
        for (const item of productos) {
            const producto = await productoModel.findById(item.producto);
            if (!producto || producto.stock < item.cantidad) {
                return res.status(400).json({ message: `Stock insuficiente para el producto: ${producto ? producto.name : 'desconocido'}` });
            }
            total += producto.precio * item.cantidad;
        }

        const nuevaCompra = new comprasModel({ usuario, productos, total });
        await nuevaCompra.save();

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

		if (idUsuario === '') {
			res.status(400).json({
				msg: 'El idUsuario es obligatorio',
			});
		}

        const compras = await comprasModel.find({ usuario: idUsuario })
            .populate('usuario', 'nombre_usuario')
            .populate('productos.producto', 'nombre_producto');

        if (compras.length === 0) {
            return res.status(404).json({
                msg: 'No se encontraron compras para este usuario',
            });
        }

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
