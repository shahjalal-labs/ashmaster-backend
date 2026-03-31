import ApiError from "../../errors/ApiErrors";
import redisClient from "../redis";
import httpStatus from "http-status";

const OTP_PREFIX = "otp:";
const OTP_EXPIRY_SECONDS = 5 * 60; // 5 minutes

export const redisOtpService = {
  // Store OTP
  async storeOtp(email: string, otp: string): Promise<void> {
    await redisClient.setex(`${OTP_PREFIX}${email}`, OTP_EXPIRY_SECONDS, otp);
  },

  // Verify OTP (returns true/false)
  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const key = `${OTP_PREFIX}${email}`;
    const storedOtp = await redisClient.get(key);

    if (!storedOtp)
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or expired otp");
    if (storedOtp !== otp)
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid otp.");

    // Delete after successful verification
    await redisClient.del(key);
    return true;
  },

  // Delete OTP (optional cleanup)
  async deleteOtp(email: string): Promise<void> {
    await redisClient.del(`${OTP_PREFIX}${email}`);
  },
};
