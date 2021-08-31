const { response } = require("express");

const Factura = require("../models/factura");

const getFacturas = async (req, res) => {
  const desde = Number(req.query.desde) || 0;

  const [facturas, total] = await Promise.all([
    Factura.find({}, "codigo nombre email valor estado img")
      .skip(desde)
      .limit(20),

    Factura.countDocuments()
  ]);

  res.json({
    ok: true,
    facturas,
    total,
  });
};

const getFacturaById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const factura = await Factura.findById(id)
      .populate("usuario", "nombre img")
      .populate("factura", "codigo nombre email valor estado img");

    res.json({
      ok: true,
      factura,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};

const crearFactura = async (req, res = response) => {
  const uid = req.uid;
  const factura = new Factura({
    usuario: uid,
    ...req.body,
  });

  try {
    const facturaDB = await factura.save();

    res.json({
      ok: true,
      factura: facturaDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarFactura = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const factura = await Factura.findById(id);

    if (!factura) {
      return res.status(404).json({
        ok: true,
        msg: "Factura no encontrada por id",
      });
    }

    const cambiosFactura = {
      ...req.body,
      usuario: uid,
    };

    const facturaActualizada = await Factura.findByIdAndUpdate(
      id,
      cambiosFactura,
      { new: true }
    );

    res.json({
      ok: true,
      factura: facturaActualizada,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarFactura = async (req, res = response) => {
  const id = req.params.id;

  try {
    const factura = await Factura.findById(id);

    if (!factura) {
      return res.status(404).json({
        ok: true,
        msg: "Factura no encontrada por id",
      });
    }

    await Factura.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Factura borrada",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getFacturas,
  crearFactura,
  actualizarFactura,
  borrarFactura,
  getFacturaById,
};
