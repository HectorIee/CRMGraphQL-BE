const Cliente = require('../models/Cliente');

///////////////// CREATE /////////////////
exports.nuevoCliente = async (input, ctx) => {
    const { email } = input;

    //Verificar si el cliente registrado
    const cliente = await Cliente.findOne({ email });
    if (cliente) throw new Error('Ese cliente ya esta registrado');

    const nuevoCliente = new Cliente(input);

    //Asignar el vendedor 
    nuevoCliente.vendedor = ctx.usuario.id;

    //Guardarlo en la BD
    try {
        const resultado = await nuevoCliente.save();
        return resultado;
    } catch (error) {
        console.log(error);
    }
}

///////////////// GET /////////////////
exports.obtenerClientes = async () => {
    try {
        const clientes = await Cliente.find({});
        return clientes;
    } catch (error) {
        console.log(error)
    }
}

exports.obtenerClientesVendedor = async (ctx) => {
    try {
        const clientes = await Cliente.find({ vendedor: ctx.usuario.id.toString() });
        return clientes;
    } catch (error) {
        console.log(error);
    }
}

exports.obtenerCliente = async (id, ctx) => {
    //Revisar si el cliente existe
    const cliente = await Cliente.findById(id);

    if(!cliente) throw new Error('Cliente no encontrado');

    //Quien lo creo solo lo puede ver 
    if(cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
    }

    return cliente;
}

///////////////// UPDATE /////////////////
exports.actualizarCliente = async (id, input, ctx) => {
    //Verificar si existe
    let cliente = await Cliente.findById(id);

    if(!cliente) throw new Error('Ese cliente no existe');

    //Verificar si el vendedor es quien edita
    if(cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('Noo tienes las creadenciales')
    }

    //guardar el cliente
    cliente = await Cliente.findOneAndUpdate({_id : id}, input, {new: true});
    return cliente;
}

exports.eliminarCliente = async (id, ctx) => {
    //Verificar si existe o no 
    let cliente = await Cliente.findById(id);

    if(!cliente) throw new Error('Ese cliente no existe');

    //Verificar si el vendedor es el que edita
    if(cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('Noo tienes las creadenciales')
    }

    //Eliminar Cliente
    await Cliente.findOneAndDelete({ _id : id});
    return "Cliente Eliminado";
}