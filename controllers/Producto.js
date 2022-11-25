const Producto = require('../models/Producto');

///////////////// CREATE /////////////////
exports.nuevoProducto = async (input) => {
    try {
        const producto = new Producto(input);

        //Almacenar en la BD
        const result = await producto.save()

        return result
    } catch (error) {
        console.log(error);
    }
}

///////////////// GET /////////////////
exports.obtenerProductos = async () => {
    try {
        const productos = await Producto.find({});

        return productos;
    } catch (error) {
        console.log(error);
    }
}

exports.obtenerProducto = async (id) => {
    //Revisar si el producto existe o no
    const producto = await Producto.findById(id);

    if (!producto) throw new Error('Producto no encontrado');

    return producto
}

exports.buscarProducto = async (texto) => {
    const productos = await Producto.find({ texto: { $search: texto}});

    return productos
}

///////////////// UPDATE /////////////////
exports.actualizarProducto = async (id, input) => {
    //Revisar si el producto existe
    let producto = await Producto.findById(id);

    if (!producto) throw new Error('Producto no encontrado');

    //Guardarlo en la BD
    producto = await Producto.findOneAndUpdate({ _id: id }, input, { new: true });

    return producto;
}

exports.eliminarProducto = async (id) => {
    //Revisar si existe producto
    let producto = await Producto.findById(id);

    if (!producto) throw new Error('Producto no encontrado');

    //Eliminar
    await Producto.findOneAndDelete({ _id: id });
    return "Producto Eliminado";
}