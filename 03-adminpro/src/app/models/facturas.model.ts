interface _FacturaUser {
    _id: string;
    nombre: string;
    img: string;
}


export class Factura {

    constructor(
        public codigo: string,
        public nombre: string,
        public email: string,
        public valor: string,
        public estado: string,        
        public _id?: string,
        public img?: string,
        public usuario?: _FacturaUser,
    ) {}

}