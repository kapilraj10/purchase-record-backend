import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // link to user
  month: { type: String, required: true },
  year: { type: String, required: true },
  buyingDate: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  supplierName: { type: String, required: true },
}, { timestamps: true });

const Purchase = mongoose.model("Purchase", PurchaseSchema);

export default Purchase;
