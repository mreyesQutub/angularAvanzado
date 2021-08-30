const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getFacturas,
    crearFactura,
    actualizarFactura,
    borrarFactura,
    getFacturaById
} = require('../controllers/factura')


const router = Router();

router.get( '/', validarJWT, getFacturas );

router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre  es necesario').not().isEmpty(),       
        validarCampos
    ], 
    crearFactura 
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre','El nombre es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarFactura
);

router.delete( '/:id',
    validarJWT,
    borrarFactura
);

router.get( '/:id',
    validarJWT,
    getFacturaById
);



module.exports = router;



