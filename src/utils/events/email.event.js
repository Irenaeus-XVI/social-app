import { EventEmitter } from "node:events";
import { customAlphabet } from "nanoid";
import { generateHash } from "../security/index.js";
import { userModel } from "../../database/model/index.js";
import { sendEmail, verifyAccountTemplate } from "../email/index.js";
export const emailEvent = new EventEmitter();

emailEvent.on("sendConfirmEmail", async (data) => {
  const { email } = data;
  const otp = customAlphabet('1234567890', 4)();
  const hashOTP = generateHash({ plainText: otp });

  await userModel.updateOne({ email }, { confirmEmailOTP: hashOTP });

  const html = verifyAccountTemplate({ otp });
  await sendEmail({
    to: email,
    subject: "Confirm-Email",
    text: `Your OTP is ${otp}`,
    html,
  });
});