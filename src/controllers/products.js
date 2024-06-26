import { request, response } from "express";
import { cloudinary } from "../config/cloudinary.js";
import {
  addProductService,
  deleteProductService,
  getProductByCodeService,
  getProductByIdService,
  getProductService,
  updateProductService,
} from "../services/products.js";

export const getProduct = async (req = request, res = response) => {
  try {
    const result = await getProductService({ ...req.query });
    return res.json({ result });
  } catch (error) {
    return res.status(500).json({ msg: "Se ha producido un error, comuniquese con su administrador" });
  }
};

export const getProductById = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const producto = await getProductByIdService(pid);

    if (!producto)
      return res.status(404).json({ msg: `El producto con id ${pid} no existe` });
    return res.json({ producto });
  } catch (error) {
    console.log("getProductById -> ", error);
    return res.status(500).json({ msg: "Se ha producido un error, comuniquese con su administrador" });
  }
};

export const addProduct = async (req = request, res = response) => {
  try {
    const { title, description, price, code, stock, category } = req.body;
    
    // Verifica los parámetros de la ruta
    console.log('Parámetros de la ruta:', req.params);
  
    // Verifica los datos del cuerpo
    console.log('Datos del cuerpo:', req.body);
  
    // Verifica el archivo subido
    console.log('Archivo subido:', req.file); 
  
    if (!title || !description || !code || !price || !stock || !category)
      return res.status(404).json({ msg: "Los campos [title, description, price, code, stock, category] son obligatorios" });
  
    const existeCode = await getProductByCodeService(code);
    console.log('Código:', code);
    
    if (existeCode)
      return res.status(400).json({ msg: "El código ingresado ya existe" });
  
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log('URL de la imagen subida:', result.secure_url);
      req.body.thumbnail = result.secure_url; // Añade la URL de la imagen al cuerpo de la solicitud
    }
  
    const producto = await addProductService({ ...req.body });
    return res.json({ producto });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    return res.status(500).json({ msg: "Se ha producido un error, comuníquese con su administrador" });
  }
};
  
export const updateProduct = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const { _id, ...rest } = req.body;
    const producto = await updateProductService(pid, rest);
    if (producto) return res.json({ msg: "Producto actualizado", producto });
    return res.status(404).json({ msg: `No se ha podido actualizar el producto id ${pid}` });
  } catch (error) {
    return res.status(500).json({ msg: "Se ha producido un error, comuniquese con su administrador" });
  }
};

export const deleteProduct = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const producto = await deleteProductService(pid);
    if (producto) return res.json({ msg: "Producto eliminado", producto });
    return res.status(404).json({ msg: `No se ha podido eliminar el producto id ${pid}` });
  } catch (error) {
    console.log("deleteProduct -> ", error);
    return res.status(500).json({ msg: "Se ha producido un error, comuniquese con su administrador" });
  }
};
