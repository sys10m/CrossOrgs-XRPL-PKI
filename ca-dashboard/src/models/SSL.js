import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const SSLSchema = mongoose.Schema(
  {
    csr: {
      type: String,
      required: [true, 'CSR is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    CA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID of CA is required'],
    },
    certificate: {
      type: String,
      // Will be populated when the certificate is issued
    },
    expiryDate: {
      type: Date,
      // Will be populated when the certificate is issued
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// index structure
SSLSchema.index({ userId: 1, status: 1 });

SSLSchema.plugin(toJSON);

export default mongoose.models.SSL || mongoose.model("SSL", SSLSchema);