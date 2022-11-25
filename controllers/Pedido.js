const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
const Pedido = require('../models/Pedido');

///////////////// CREATE /////////////////
exports.nuevoPedido = async (input, ctx) => {
    const { cliente } = input

    // Verificar si existe o no
    let clienteExiste = await Cliente.findById(cliente);

    if (!clienteExiste) {
        throw new Error('Ese cliente no existe');
    }

    // Verificar si el cliente es del vendedor
    if (clienteExiste.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
    }

    // Revisar que el stock este disponible
    for await (const articulo of input.pedido) {
        const { id } = articulo;

        const producto = await Producto.findById(id);

        if (articulo.cantidad > producto.existencia) {
            throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible`);
        } else {
            // Restar la cantidad a lo disponible
            producto.existencia = producto.existencia - articulo.cantidad;

            await producto.save();
        }
    }

    // Crear un nuevo pedido
    const nuevoPedido = new Pedido(input);

    // asignarle un vendedor
    nuevoPedido.vendedor = ctx.usuario.id;


    // Guardarlo en la base de datos
    const resultado = await nuevoPedido.save();
    return resultado;

}

///////////////// GET /////////////////
exports.obtenerPedidos = async () => {
    try {
        const pedidos = await Pedido.find({});
        return pedidos;
    } catch (error) {
        console.log(error);
    }
}

exports.obtenerPedidosVendedor = async (ctx) => {
    try {
        const pedidos = await Pedido.find({ vendedor: ctx.usuario.id }).populate('cliente');

        // console.log(pedidos);
        return pedidos;
    } catch (error) {
        console.log(error);
    }
}

exports.obtenerPedido = async (id, ctx) => {
    // Si el pedido existe o no
    const pedido = await Pedido.findById(id);
    if (!pedido) {
        throw new Error('Pedido no encontrado');
    }

    // Solo quien lo creo puede verlo
    if (pedido.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
    }

    // retornar el resultado
    return pedido;
}

exports.obtenerPedidosEstatus = async (estatus, ctx) => {
    const pedidos = await Pedido.find({ vendedor: ctx.usuario.id, estado });

    return pedidos;;
}

///////////////// UPDATE /////////////////
exports.actualizarPedido = async (id, input, ctx) => {
    //Verificar si existe
    let pedido = await Cliente.findById(id);

    if (!pedido) throw new Error('Ese pedido no existe');

    //Verificar si el vendedor es quien edita
    if (pedido.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('Noo tienes las creadenciales')
    }

    //guardar el pedido
    pedido = await Cliente.findOneAndUpdate({ _id: id }, input, { new: true });
    return pedido;
}

exports.eliminarPedido = async (id, ctx) => {
    //Verificar si existe o no 
    let pedido = await Cliente.findById(id);

    if (!pedido) throw new Error('Ese pedido no existe');

    //Verificar si el vendedor es el que edita
    if (pedido.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('Noo tienes las creadenciales')
    }

    //Eliminar pedido
    await Pedido.findOneAndDelete({ _id: id });
    return "Pedido Eliminado";
}