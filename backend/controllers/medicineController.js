import { StatusCodes } from "http-status-codes";
import MedicineSchedule from "../models/MedGroup.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../Errors/index.js";
import User from "../models/user.js";
import getCurrentWeekday from "../utils/getCurrentWeekday.js";
import moment from "moment";

const createMedicineGroup = async (req, res) => {
  let { medicines, time, weekdays, uid } = req.body;
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
  if (!medicines || !time || !weekdays || !uid) {
    throw new BadRequestError("Please provide all required fields.");
  }
  const medicineGroup = await MedicineSchedule.create({
    medicines,
    time,
    weekdays,
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

const medicineList = async (req, res) => {
  const { userId, userRole } = req.user;
  const { id } = req.params;
  if (userRole === "caretaker") {
    const careTaker = await User.findOne({ _id: userId });
    if (!careTaker) {
      throw new UnauthenticatedError("Invalid Authentication");
    }
    if (!careTaker.eid.includes(id)) {
      throw new UnauthenticatedError("Invalid Access");
    }
  } else {
    const elder = await User.findOne({ _id: userId });
    if (!elder) {
      throw new UnauthenticatedError("Invalid Authentication");
    }
    if (elder._id.toString() !== id) {
      throw new UnauthenticatedError("Invalid Access");
    }
  }
  const currentWeekday = getCurrentWeekday();
  const medicineGroups = await MedicineSchedule.find({
    uid: id,
    weekdays: currentWeekday,
  });

  const groupedMedicines = medicineGroups.map((group) => ({
    medicines: group.medicines.map((medicine) => ({
      name: medicine.name,
      dosage: medicine.dosage,
    })),
    time: group.time,
  }));

  res.status(StatusCodes.OK).json({ medicineList: groupedMedicines });
};

const logMedicine = async (req, res) => {
  const { userId, userRole } = req.user;
  const { id: medicineGroupId } = req.params;
  const todayStart = moment().startOf("day");
  const todayEnd = moment().endOf("day");

  const medicineGroup = await MedicineSchedule.findById(medicineGroupId);
  if (!medicineGroup) {
    throw new NotFoundError("Medicine group not found.");
  }

  if (userRole === "caretaker") {
    const careTaker = await User.findById(userId);
    if (!careTaker) {
      throw new UnauthenticatedError("Invalid Authentication");
    }
    if (!careTaker.eid.includes(medicineGroup.uid)) {
      throw new UnauthenticatedError("Invalid Access");
    }
  } else {
    if (userId !== medicineGroup.uid.toString()) {
      throw new UnauthenticatedError("Invalid Access");
    }
  }

  const isMedicineLoggedToday = medicineGroup.intake.some((epoch) => {
    const intakeDate = moment(epoch * 1000);
    return intakeDate.isBetween(todayStart, todayEnd, null, "[]");
  });

  if (isMedicineLoggedToday) {
    throw new BadRequestError("Medicine already marked for intake today.");
  }

  const currentEpoch = moment().unix();
  medicineGroup.intake.push(currentEpoch);
  await medicineGroup.save();

  res.status(StatusCodes.OK).json({ message: "Medicine logged successfully." });
};

export { createMedicineGroup, editMedicineGroup, medicineList, logMedicine };
