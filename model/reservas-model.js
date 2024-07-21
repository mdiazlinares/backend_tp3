const { Schema, model } = require('mongoose');

const ReservaSchema = Schema({
    id_cancha: { type: Schema.Types.ObjectId, ref: 'Cancha', required: true },
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    fecha: { type: Date, required: true },
    horaInicio: { type: Number, required: true },
    horaFin: { type: Number, required: true }
});

module.exports = model('Reservas', ReservaSchema);


