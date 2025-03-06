import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// Check if the model exists before defining it
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['client', 'ca'],
      default: 'client',
      required: [true, 'Role is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Additional fields for CA users
    organization: {
      type: String,
      required: function() { return this.role === 'ca'; },
    },
    organizationUnit: {
      type: String,
      required: function() { return this.role === 'ca'; },
    },
    country: {
      type: String,
      required: function() { return this.role === 'ca'; },
    },
    state: {
      type: String,
      required: function() { return this.role === 'ca'; },
    },
    locality: {
      type: String,
      required: function() { return this.role === 'ca'; },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Add method to check if user is CA
userSchema.methods.isCA = function() {
  return this.role === 'ca';
};

// Add method to check if user is Client
userSchema.methods.isClient = function() {
  return this.role === 'client';
};

userSchema.plugin(toJSON);

export default mongoose.models.User || mongoose.model("User", userSchema);