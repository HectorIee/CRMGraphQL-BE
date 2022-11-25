const {
    obtenerUsuario,
    nuevoUsuario,
    authUsuario
} = require('../controllers/Usuario')

const {
    obtenerProductos,
    obtenerProducto,
    nuevoProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/Producto')

const {
    obtenerClientes,
    obtenerClientesVendedor,
    obtenerCliente,
    nuevoCliente,
    actualizarCliente,
    eliminarCliente
} = require('../controllers/Cliente')

const {
    obtenerPedidos,
    obtenerPedidosVendedor,
    obtenerPedido,
    obtenerPedidosEstatus,
    nuevoPedido,
    actualizarPedido,
    eliminarPedido
} = require('../controllers/Pedido')

const {
    mejoresClientes,
    mejoresVendedores
} = require('../controllers/Mejores')

//Resolvers
const resolvers = {
    Query: {
        //USUARIO
        obtenerUsuario: (_,{},ctx) => obtenerUsuario(ctx),

        //PRODUCTO
        obtenerProductos: () => obtenerProductos(),
        obtenerProducto: (_, {id}) => obtenerProducto(id),
        buscarProducto: (_, {texto}) => buscarProducto(texto),

        //CLIENTE
        obtenerClientes: () => obtenerClientes(),
        obtenerClientesVendedor: (_, { }, ctx) => obtenerClientesVendedor(ctx),
        obtenerCliente: (_, {id}, ctx) => obtenerCliente(id, ctx),

        //PEDIDO
        obtenerPedidos: () => obtenerPedidos(),
        obtenerPedidosVendedor: (_, {}, ctx) => obtenerPedidosVendedor(ctx),
        obtenerPedido: (_, {id}, ctx) => obtenerPedido(id, ctx),
        obtenerPedidosEstatus: (_, {estatus}, ctx) => obtenerPedidosEstatus(estatus, ctx),

        //BUSQUEDAS AVANADAS
        mejoresClientes: () => mejoresClientes(),
        mejoresVendedores: () => mejoresVendedores(),
    },
    Mutation: {
        //USUARIO
        nuevoUsuario: (_, { input }) => nuevoUsuario(input),
        authUsuario: (_, { input }) => authUsuario(input),

        //PRODUCTO
        nuevoProducto: (_, {input}) => nuevoProducto(input),
        actualizarProducto: (_, {id, input}) => actualizarProducto(id, input),
        eliminarProducto: (_, {id}) => eliminarProducto(id),

        //CLIENTE
        nuevoCliente: (_, {input}, ctx) => nuevoCliente(input, ctx),
        actualizarCliente: (_, {id, input}, ctx) => actualizarCliente(id, input, ctx),
        eliminarCliente: (_, {id}, ctx) => eliminarCliente(id, ctx),

        //PEDIDO
        nuevoPedido: (_, {input}, ctx) => nuevoPedido(input, ctx),
        actualizarPedido: (_, {id, input}, ctx) => actualizarPedido(id, input, ctx),
        eliminarPedido: (_, {id}, ctx) => eliminarPedido(id, ctx),
    }
}

module.exports = resolvers;
