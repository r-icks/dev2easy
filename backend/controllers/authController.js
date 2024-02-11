import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../Errors/index.js";
import attachCookie from "../utils/attachCookie.js";
import User from "../models/user.js";

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

export { register, login, getCurrentUser, logout, getAllUsers, registerElder };
