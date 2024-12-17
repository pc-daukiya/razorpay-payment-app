const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

// Razorpay instance
const razorpay = new Razorpay({
    key_id: 'rzp_live_IHWpEC1oBXHxl4',        // Replace with your Razorpay Key ID
    key_secret: '4xQs6iCFDOxQTRJqen6z8f3H'    // Replace with your Razorpay Key Secret
});

// Serve the index.html file located at the root directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to create a Razorpay order
app.post('/create-order', async (req, res) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).send({ error: "Invalid amount" });
    }

    const options = {
        amount: amount * 100, // Amount in paise (multiply by 100)
        currency: "INR",
        receipt: `receipt_${Date.now()}`
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send("Error creating order");
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
