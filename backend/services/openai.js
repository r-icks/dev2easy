import OpenAI from "openai";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const medicineDosage = async (medText) => {
  const completionConfig = {
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content: `You are a chemist and u have received a text output from an OCR which read your prescription. Group the medicines together based on when they can be taken. For example, add medicines that can be taken after lunch to the same group. You have to return an array of json objects. The requested format is: {"medicineGroups": [{"medicines":[{"name":"String (required)","dosage":"String (required)"}],"time":"String (required)","weekdays":["String (two-letter abbreviation)",...](required, array)}]} It should return multiple medicine groups which can each have multiple medicines that are to be consumed at the same time. If you are unsure about anything you can leave those fields blank because a person would then manually check. Please note that assumption of the correct timings should be made for timings like lunch. Time should be in the following format: HH:MM 24-hr`,
      },
      {
        role: "user",
        content: `This is the text that you received from OCR: \n\n${medText}`,
      },
    ],
    temperature: 0.5,
    response_format: { type: "json_object" },
    max_tokens: 2500,
  };
  const response = JSON.parse(
    (await openai.chat.completions.create(completionConfig)).choices[0].message
      .content
  );
  return response;
};
