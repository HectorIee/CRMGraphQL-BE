const Pedido = require('../models/Pedido');

exports.mejoresClientes = async () => {
    const clientes = await Pedido.aggregate([
        { $match: {estatus: "COMPLETADO"}},
        { $group: {
            _id: "$cliente",
            total: {$sum: '$total'}
        }},
        {
            $lookup: {
                from: 'clientes',
                localField: '_id',
                foreignField: "_id",
                as: "cliente"
            }
        },
        {
            $sort: {total: -1}
        }
    ]);
    return clientes;
}

exports.mejoresVendedores = async () => {
    const vendedores = await Pedido.aggregate([
        { $match: {estatus: "COMPLETADO"}},
        { $group: {
            _id: "$vendedor",
            total: {$sum: '$total'}
        }},
        {
            $lookup: {
                from: 'usuarios',
                localField: '_id',
                foreignField: "_id",
                as: "vendedor"
            }
        },
        {
            $limit: 3
        },
        {
            $sort: {total: -1}
        }
    ]);
    return vendedores;
}