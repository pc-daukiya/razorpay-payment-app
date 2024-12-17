const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());

const razorpay = new Razorpay({
    key_id: 'rzp_live_IHWpEC1oBXHxl4',        
    key_secret: '4xQs6iCFDOxQTRJqen6z8f3H'    
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/create-order', async (req, res) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).send({ error: "Invalid amount" });
    }

    const options = {
        amount: amount * 100, 
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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
