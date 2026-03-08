import * as clientService from "../services/clientServices.js";

export const getUsers = async (req, res) => {
  try {
    const users = await clientService.getUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error("error fetching clients", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const profile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: "User is Not Logged In" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Cannot Find User", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.id;
    const userData = req.body;
    const updatedUser = await clientService.updateUser(userData, userId);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not Found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error Updating User", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleted = await clientService.deleteUser(userId);
    if (!deleted) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).send();
  } catch (err) {
    console.error("Error Deleting User", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchUser = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const user = await clientService.searchUser(searchTerm);
    res.status(200).json(user);
  } catch (err) {
    console.error("Error Searching User", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const productsList = async (req, res) => {
  try {
    const products = await clientService.getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error Cannot get Products", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await clientService.getSingleProduct(slug);
    const { product_id } = product;
    const variant = await clientService.getProductVariants(product_id);
    res.status(200).json({ product, variant });
  } catch (err) {
    console.error("Error Cannot get Products", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductByCartItemsId = async (req, res) => {
  try {
    const user_id = req.id;
    const { cart_items_id } = req.params;
    const userCart = await clientService.getUserCart(user_id);
    const { cart_id } = userCart;
    const cartItem = await clientService.getProductByCartItemsId(
      cart_id,
      cart_items_id
    );
    res.status(200).json(cartItem);
  } catch (err) {
    console.error("Error Cannot get Products", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { product_id, product_variant_id } = req.body;
    const user_id = req.id;
    const userCart = await clientService.getUserCart(user_id);
    const { cart_id } = userCart;
    let addItem;
    if (!product_variant_id) {
      addItem = await clientService.addItem(cart_id, product_id);
    } else {
      addItem = await clientService.addItem(
        cart_id,
        product_id,
        product_variant_id
      );
    }
    res.status(200).json(addItem);
  } catch (err) {
    console.error("Error Cannot get Products", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const user_id = req.id;
    const { productId, product_variant_id, quantity } = req.body;
    const userCart = await clientService.getUserCart(user_id);
    const { cart_id } = userCart;
    const newQuantity = await clientService.updateQuantity(
      cart_id,
      productId,
      product_variant_id,
      quantity
    );
    res.status(200).json(newQuantity);
  } catch (err) {
    console.error("Error Updating Quantity", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const user_id = req.id;
    const { productId } = req.params;
    const newCart = await clientService.cartVariantRemove(user_id, productId);
    res.status(200).json(newCart);
  } catch (err) {
    console.error("Error Updating Quantity", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
