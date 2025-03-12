import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const emailSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
        type: String,
        required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    html: {
      type: String,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Email",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

emailSchema.plugin(toJSON);

export default mongoose.models.Email || mongoose.model("Email", emailSchema);
