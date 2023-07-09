const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const valid = require("../validations/valid");
// fuction for getting total price based on number of items
function TotalPrice(items, products) {
  let totalPrice = 0;
  for (const item of items) {
    const product = products.find(
      (product) => product._id.toString() === item.productId.toString()
    );
    if (product) {
      totalPrice += product.price * item.quantity;
    }
  }
  return totalPrice;
}
// creating cart but based on condition that if cart exist then update otherwise create new cart
const createCart = async function (req, res) {
  try {
    const userId = req.params.userId;
    const data = req.body;
    if (!userId || !data.items) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter the required values." });
    }
    if (!valid.isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid userId." });
    }
    // because items in the body is kind of array so after iterating we can get the productId , after getting it , i am checking validation for it
    for (let product of data.items) {
      if (!valid.isValidObjectId(product.productId)) {
        return res
          .status(400)
          .send({ status: false, message: "Please enter a valid productId." });
      }
    }
    // checking validation for cart id if it is entered by the user
    if (data.cartId && !valid.isValidObjectId(data.cartId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter the valid cart id" });
    }
    // checking user like it exist or not
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "User not found." });
    }
    // creating array of productId after seperating from array(items)
    const productIds = data.items.map((item) => item.productId);
    // checking that product exist or not
    const products = await productModel.find({
      _id: { $in: productIds },
      isDeleted: false,
    });

    if (products.length !== productIds.length) {
      return res
        .status(404)
        .send({
          status: false,
          message: "Invalid product(s) or product(s) not found.",
        });
    }
    //checking cart exist or not
    let cart = await cartModel.findOne({ userId: userId });

    if (cart && data.cartId && cart._id != data.cartId) {
      return res
        .status(403)
        .send({ status: false, message: "you are not authorised" });
    }
    // Create the cart if it doesn't exist
    if (!cart) {
      cart = await cartModel.create({
        userId: userId,
        items: [],
        totalPrice: 0,
        totalItems: 0,
      });
    }
    // Add the product(s) to the cart
    for (const item of data.items) {
      const existingItem = cart.items.find(
        (existingItem) =>
          existingItem.productId.toString() === item.productId.toString()
      );
      if (existingItem) {
        // If the product already exists in the cart, update the quantity
        existingItem.quantity += item.quantity;
      } else {
        // If the product doesn't exist in the cart, add it as a new item
        cart.items.push({
          productId: item.productId,
          quantity: item.quantity,
        });
      }
      // Update totalItems
      cart.totalItems = cart.items.length;
    }

    // Calculate the total price of the cart based on the product prices
    cart.totalPrice = TotalPrice(cart.items, products);

    // Save the updated cart
    await cart.save();

    // Return the updated cart document with product details
    const response = {
      _id: cart._id,
      userId: cart.userId,
      items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalPrice: cart.totalPrice,
      totalItems: cart.totalItems,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };

    return res.status(201).send({status:true,message:'success',data:response});
  } catch (error) {
    if (error.message.includes("validation")) {
      return res.status(400).send({ status: false, message: error.message });
    } else if (error.message.includes("duplicate")) {
      return res.status(400).send({ status: false, message: error.message });
    } else {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
};
const updateCart = async function (req, res) {
  try {
    const userId = req.params.userId;
    const data = req.body;
    if (!userId) {
      return res
        .status(404)
        .send({ status: false, message: "Please enter the valid URL values." });
    }
    if (!valid.isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid userId." });
    }
    if (data.productId && !valid.isValidObjectId(data.productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid productId." });
    }

    // checking validation for cart id if it is entered by the user
    if (data.cartId && !valid.isValidObjectId(data.cartId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter the valid cart id" });
    }
    // checking user like it exist or not
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "User not found." });
    }
    // checking that product exist or not
    const products = await productModel.find({
      _id: data.productId,
      isDeleted: false,
    });

    if (products.length == 0) {
      return res
        .status(404)
        .send({
          status: false,
          message: "Invalid product(s) or product(s) not found.",
        });
    }
    //checking cart exist or not
    let cart = await cartModel.findOne({ _id: data.cartId });
    if (!cart) {
      return res
        .status(404)
        .send({ status: false, message: "cart not found." });
    }
    if (cart && cart.userId != userId) {
      return res.status(403).send({ status: false, message: "you are not authorised" });
    }
    let Check = cart.items.find((x) => x.productId.toString() === data.productId.toString()
    );
    if (Check == undefined) {
      return res.status(404).send({ status: false, message: "product is not found " })
    }
    if (data.removeProduct === 0) {
      // Remove the product from the cart
      if (cart.items.length > 0) {
        let Check = cart.items.find(
          (x) => x.productId.toString() === data.productId.toString()
        );
        if (Check !== undefined) {
          cart.items = cart.items.filter(
            (item) => item.productId.toString() !== data.productId.toString()
          );
        }
      }
      // return res.status(200).send({status:false,message:cart})
    } else if (data.removeProduct === 1) {
      // Decrement the quantity of the product by 1 in the cart
      if (cart.items.length > 1) {
        for (let i = 0; i < cart.items.length; i++) {
          if (cart.items[i].productId == data.productId) {
            cart.items[i].quantity -= 1;
          }
        }
      } else {
        if (cart.items.length > 0) {
          let Check = cart.items.find(
            (x) => x.productId.toString() === data.productId.toString()
          );
          if (Check !== undefined) {
            cart.items = cart.items.filter(
              (item) => item.productId.toString() !== data.productId.toString()
            );
          }
        }
      }
    } else {
      return res
        .status(200)
        .send({ status: false, message: "nothing to update" });
    }
    // Update totalItems
    cart.totalItems = cart.items.length;

    // Calculate the total price of the cart based on the product prices
    cart.totalPrice = TotalPrice(cart.items, products);

    // Save the updated cart
    await cart.save();

    // Return the updated cart document with product details
    const response = {
      cartId: cart._id,
      userId: cart.userId,
      items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalPrice: cart.totalPrice,
      totalItems: cart.totalItems,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
    return res.status(201).send({status:true,message:'success',data:response});
  } catch (error) {
    if (error.message.includes("validation")) {
      return res.status(400).send({ status: false, message: error.message });
    } else if (error.message.includes("duplicate")) {
      return res.status(400).send({ status: false, message: error.message });
    } else {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
};
const getCart = async function (req, res) {
  try {
    const userId = req.params.userId
    if (!valid.isValidObjectId(userId)) {
      return res.status(404).send({ status: false, message: "Please enter a valid userId" })
    }
    const cart = await cartModel.findOne({ userId: userId })
    if (!cart) {
      return res.status(404).send({ status: false, message: "cart not found" })
    }
    const response = {
      cartId: cart._id,
      userId: cart.userId,
      items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalPrice: cart.totalPrice,
      totalItems: cart.totalItems,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
    return res.status(200).send({ status: false, message: "success", data: response })
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}
const deleteCart = async function (req, res) {
  try {
    const userId = req.params.userId
    if (!valid.isValidObjectId(userId)) {
      return res.status(404).send({ status: false, message: "Please enter a valid userId" })
    }
    const cart = await cartModel.findOne({ userId: userId })
    if (!cart) {
      return res.status(404).send({ status: false, message: "cart not found" })
    }
    cart.items = []
    cart.totalItems = 0
    cart.totalPrice = 0
    await cart.save()
    const response = {
      cartId: cart._id,
      userId: cart.userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      totalItems: cart.totalItems,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
    return res.status(200).send({ status: false, message: "success", data: response })
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}
module.exports = { createCart, updateCart, getCart, deleteCart };
