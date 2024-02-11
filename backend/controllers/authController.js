import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../Errors/index.js";
import attachCookie from "../utils/attachCookie.js";
import User from "../models/User.js";
import { sendMagicEmail } from "../services/nodemailer.js";

const register = async (req, res) => {
  const { name, email, password, accountType, phoneNumber, age, sex } =
    req.body;
  if (
    !name ||
    !email ||
    !password ||
    !accountType ||
    !phoneNumber ||
    !age ||
    !sex
  ) {
    throw new BadRequestError("Please provide all values!");
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }
  const user = await User.create({
    name,
    email,
    password,
    accountType,
    phoneNumber,
    age,
    sex,
  });
  const token = user.createJWT();
  attachCookie({ token, res });
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all values!");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  attachCookie({ token, res });
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user });
};

const getAllUsers = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
  const elderIds = user.eid;
  const elders = await User.find(
    { _id: { $in: elderIds } },
    { name: 1, _id: 1, age: 1, sex: 1 }
  );
  res.status(StatusCodes.OK).json({ elders });
};

const registerElder = async (req, res) => {
  const { userId } = req.user;
  const careTaker = await User.findOne({ _id: userId });
  if (!careTaker) {
    throw new UnauthenticatedError("Invalid Authentication");
  }
  const { name, email, password, phoneNumber, age, sex } = req.body;
  if (!name || !email || !password || !phoneNumber || !age || !sex) {
    throw new BadRequestError("Please provide all values!");
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }
  const user = await User.create({
    name,
    email,
    password,
    accountType: "elder",
    phoneNumber,
    age,
    sex,
  });
  careTaker.eid.push(user._id);
  await careTaker.save();
};

const magicLogin = async (req, res) => {
  const { userId } = req.userId;
  const { elderId } = req.body;
  const careTaker = await User.findOne({ _id: userId });
  if (!careTaker) {
    throw new UnauthenticatedError("Invalid Authentication");
  }
  if (!careTaker.eid.includes(elderId)) {
    throw new UnauthenticatedError("Invalid Access");
  }
  const elder = await User.findOne({ _id: elderId });
  if (!elder) {
    throw new NotFoundError("Elder not found");
  }
  const token = jwt.sign(
    { userId: this._id, userRole: this.accountType, magicLogin: true },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  await sendMagicEmail({
    name: elder.name,
    email: elder.email,
    magicLink: `${process.env.FRONTEND_URL}/login/${token}`,
  });
  res.status(StatusCodes.OK).json({ msg: "Login email sent!" });
};

const approveLogin = async (req, res) => {
  const { token } = req.params;
  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
  const { userId, userRole, magicLogin } = jwt.verify(
    token,
    process.env.JWT_SECRET
  );
  if (!magicLogin) {
    throw new UnauthenticatedError("Invalid magic login");
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError("User not found");
  }
  const loginToken = user.createJWT();
  attachCookie({ token: loginToken, res });
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user });
};

export {
  register,
  login,
  getCurrentUser,
  logout,
  getAllUsers,
  registerElder,
  magicLogin,
  approveLogin,
};
