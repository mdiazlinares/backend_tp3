const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
	nombre_usuario: {
		type: String,
		required: true,
	},

	edad: {
		type: Number,
	},

	email: {
		type: String,
		required: true,
		unique: true,
	},

	password: {
		type: String,
		required: true,
	},

	rol: {
		type: String,
		default: 'Usuario',
	},

	estado: {
		type: Boolean,
		required: true,
		default: true,
	}
});

module.exports = model('Usuarios', UsuarioSchema);
