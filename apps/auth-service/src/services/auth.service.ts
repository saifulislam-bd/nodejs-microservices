import { AppError } from "shared";
import { createUser, findByEmail } from "../repositories/user.repo";
import { RegisterInput } from "../schemas/auth.schemas";
import { convertToPublicUser } from "../utils/auth.utils";
import bcrypt from "bcryptjs";

export async function register(input: RegisterInput) {
  const existingUser = await findByEmail(input.email);

  if (existingUser)
    throw new AppError("This email is already registered!", 409);

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await createUser({
    name: input.name,
    email: input.email,
    passwordHash,
    role: "USER",
  });
  return convertToPublicUser(user);
}
