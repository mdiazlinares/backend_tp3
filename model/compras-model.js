const { Schema, model } = require('mongoose');

const CompraSchema = Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios', required: true },
    productos: [
        {
            producto: { type: Schema.Types.ObjectId, ref: 'Productos', required: true },
            cantidad: { type: Number, required: true }
        }
    ],
    total: { type: Number, required: true },
    fecha: { type: Date, default: Date.now }
});

module.exports = model('Compras', CompraSchema);
