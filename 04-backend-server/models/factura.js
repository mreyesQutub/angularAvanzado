const { Schema, model } = require("mongoose");

const FacturaSchema = Schema({
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  valor: {
    type: String,
  },
  estado: {
    type: String,
    required:true,
    default:"activo"
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

FacturaSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Factura", FacturaSchema);