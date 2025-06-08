// models/calendar.js
const mongoose = require( "mongoose");

const diaSchema = new mongoose.Schema({
  dia: { type: Number, required: true, min: 1, max: 31 },
  questCompletada: { type: Boolean, default: false }
});

const calendarSchema = new mongoose.Schema({
  jugadorId: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
  año: { type: Number, required: true },
  mes: { type: String, required: true }, // Ej: "abril"
  dias: [diaSchema]
});

module.exports = mongoose.model("Calendar", calendarSchema);
