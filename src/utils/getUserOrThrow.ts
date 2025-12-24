import httpStatus from "http-status";
import ApiError from "../errors/ApiErrors";

export const findOrThrow = async <T>(
  model: { findUnique: (args: { where: { id: string } }) => Promise<T | null> },
  id: string,
) => {
  const record = await model.findUnique({
    where: { id },
  });

  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, `Record not found`);
  }

  return record;
};
