const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: { type: String, required: true }, // Or an ID if you have Auth
    items: [
        {
            titulli: String,
            sasia: Number,
            cmimi: Number,
            imazhi: String
        }
    ],
    total: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
