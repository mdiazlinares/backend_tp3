const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
	name: {
		type: String,
		required: true,
        unique: true,
	},

	precio: {
		type: Number,
		required: true,
	},

	descripcion: {
		type: String,
		required: true,
	},

	stock: {
		type: Number,
		required: true,
	},	

	estado: {
		type: Boolean,
		required: true,
		default: true,
	},	

	imagen: {
		type: String
	},

});

module.exports = model('Productos', ProductoSchema);
