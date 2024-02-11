import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../Errors/index.js";
import { textractAnalyse } from "../services/aws.js";
import { medicineDosage } from "../services/openai.js";

const readPrescription = async (req, res) => {
  const { file } = req;
  if (!file) {
    throw new BadRequestError("Please provide a file");
  }

  const allowedFormats = ["image/jpeg", "image/png"];
  if (!allowedFormats.includes(req.file.mimetype)) {
    throw new BadRequestError("Only jpeg or png files are accepted");
  }

  const result = await textractAnalyse({ file: file.buffer });
  const formattedResult = await medicineDosage(result);
  res.status(StatusCodes.OK).json(formattedResult);
};

export { readPrescription };
