const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// POST /shoppingCart/setItemdetails
router.post("/setItemdetails", (req, res) => {
  const { itemNumber, quantity } = req.body;

  // Check item details 
    
 const itemDetails = {
   itemNumber: "ABC123",
   title: "Smartphone",
   description: "High-performance smartphone with advanced features",
   color: "Black",
   quantityInHand: 20,
   status: "promotion",
   price: 99.99,
 };


  // Calculate discounted price if applicable
  let totalPrice;
  if (
    itemDetails.status === "promotion" &&
    itemDetails.quantityInHand >= quantity
  ) {
    const discount = 0.2; // 20% discount
    const discountedPrice = itemDetails.price - itemDetails.price * discount;
    totalPrice = discountedPrice * quantity;
  } else {
    totalPrice = itemDetails.price * quantity;
  }

  // Generate a session ID using UUID
  const sessionId = uuidv4();

  // Set item details in the session
  req.session.shoppingCart = {
    sessionId,
    itemNumber: itemDetails.itemNumber,
    title: itemDetails.title,
    description: itemDetails.description,
    color: itemDetails.color,
    quantity,
    price: totalPrice,
    quantityInHand: itemDetails.quantityInHand,
  };

  res.json({ sessionId });
});

module.exports = router;
