const { Schema, model } = require('mongoose');

const ReservaSchema = Schema({
    id_cancha: { type: Schema.Types.ObjectId, ref: 'Cancha', required: true },
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    fecha: { type: Date, required: true },
    horaInicio: { type: Number, required: true }, // Usaremos formato de 24 horas, ej. 13 para 1 PM
    horaFin: { type: Number, required: true } // Debe ser mayor a horaInicio
});

module.exports = model('Reservas', ReservaSchema);

