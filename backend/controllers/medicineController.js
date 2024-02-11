import { StatusCodes } from "http-status-codes";
import MedicineSchedule from "../models/MedicineSchedule";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../Errors/index.js";
import User from "../models/user.js";

const createMedicineGroup = async (req, res) => {
  const { medicines, time, weekdays, intake, uid } = req.body;
  const { userRole, userId } = req.user;
  if (userRole === "elder") {
    uid = userId;
  } else if (userRole === "caretaker") {
    const careTaker = await User.findOne({ _id: userId });
    const idExists = careTaker.eid.includes(uid);
    if (!idExists) {
      throw new UnauthenticatedError("Invalid Access");
    }
  }
  if (!medicines || !time || !weekdays || !intake || !uid) {
    throw new BadRequestError("Please provide all required fields.");
  }
  const medicineGroup = await MedicineSchedule.create({
    medicines,
    time,
    weekdays,
    intake,
    uid,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Medicine group created successfully.", medicineGroup });
};

const editMedicineGroup = async (req, res) => {
  const { id } = req.params;
  const { medicines, time, weekdays, intake } = req.body;
  const { userId, userRole } = req.user;
  if (!medicines || !time || !weekdays || !intake) {
    throw new BadRequestError("Please provide all required fields.");
  }
  const medicineGroupExists = await medicineGroup.findOne({ _id: id });
  if (!medicineGroupExists) {
    throw new NotFoundError("Medicine group not found.");
  }
  if (userRole === "elder") {
    if (medicineGroupExists._id !== userId) {
      throw new UnauthenticatedError("Invalid Access");
    }
  } else if (userRole === "caretaker") {
    const user = await User.findOne({ _id: userId });
    if (!user.eid.includes(medicineGroupExists._id)) {
      throw new UnauthenticatedError("Invalid Access");
    }
  }
  const updatedMedicineGroup = await MedicineSchedule.findByIdAndUpdate(
    id,
    { medicines, time, weekdays, intake },
    { new: true }
  );
  if (!updatedMedicineGroup) {
  }
  res.status(StatusCodes.OK).json({
    message: "Medicine group updated successfully.",
    updatedMedicineGroup,
  });
};

export { createMedicineGroup, editMedicineGroup };
