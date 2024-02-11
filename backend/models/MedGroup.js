import mongoose from "mongoose";

const MedicineGroupSchema = new mongoose.Schema(
  {
    medicines: [
      {
        name: {
          type: String,
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
      },
    ],
    time: {
      type: String,
      required: true,
    },
    weekdays: {
      type: [String],
      validate: {
        validator: function (value) {
          return (
            value.length > 0 && value.every((day) => /^[a-zA-Z]{2}$/.test(day))
          );
        },
        message:
          "Weekdays should be provided as an array of two-letter abbreviations (e.g., 'Mo', 'Tu', etc.).",
      },
      required: true,
    },
    intake: {
      type: [Number],
      required: true,
    },
    uid: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the user"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("MedicineSchedule", MedicineGroupSchema);
