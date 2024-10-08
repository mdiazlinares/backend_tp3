const { Schema, model } = require('mongoose');

const CanchaSchema = Schema({
	nombre_cancha: {
		type: String,
		required: true,
	},

	descripcion: {
		type: String,
		required: true,
	},

	estado: {
		type: Boolean,
		required: true,
		default: true,
	},	

	imagen: {
		type: String,
		required: true,
	},

	cesped: {
		type: String,
		required: true,
	},	

	tamanio: {
		type: Number,
		required: true,
	},

	precio: {
		type: Number,
		required: true,
	},	
});

module.exports = model('Canchas', CanchaSchema);
