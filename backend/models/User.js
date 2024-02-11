import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the Name"],
    minlength: 3,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide the Email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide the Password"],
    minlength: 6,
    select: false,
  },
  accountType: {
    type: String,
    enum: ["caretaker", "elder"],
    required: [true, "Please provide the account type"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide the Phone Number"],
    validate: {
      validator: (value) => {
        return validator.isMobilePhone(value, "any", { strictMode: false });
      },
      message: "Please provide a valid phone number",
    },
  },
  eid: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  age: {
    type: Number,
    required: true,
    min: 0,
  },
  sex: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, userRole: this.accountType },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

export default mongoose.model("User", UserSchema);
