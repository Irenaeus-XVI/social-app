import { EventEmitter } from "node:events";
import { customAlphabet } from "nanoid";
import { generateHash } from "../security/index.js";
import { userModel } from "../../database/model/index.js";
import { sendEmail, verifyAccountTemplate } from "../email/index.js";
import * as dbService from "../../database/db.service.js";
export const emailEvent = new EventEmitter();
const emailSubject = {
  confirm: "Confirm-Email",
  forget: "Forget-Password",
};

emailEvent.on("sendConfirmEmail", async (data) => {
  await sendCode(data, emailSubject.confirm, 'confirmEmailOTP');
});

emailEvent.on("sendForgetPassword", async (data) => {
  await sendCode(data, emailSubject.forget, 'forgetPasswordOTP');
});



export const sendCode = async (data = {}, subject = emailSubject.confirm, type = 'confirmEmailOTP') => {
  const { id, email } = data;
  const otp = customAlphabet('1234567890', 4)();
  const hashOTP = generateHash({ plainText: otp });
  const updateData = {
    [type]: hashOTP,
  };

  await dbService.updateOne({ model: userModel, filters: { _id: id }, data: updateData });

  const html = verifyAccountTemplate({ code: otp });
  await sendEmail({
    to: email,
    subject: subject,
    text: `Your OTP is ${otp}`,
    html,
  });
};