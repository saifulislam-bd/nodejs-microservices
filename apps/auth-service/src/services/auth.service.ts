import { AppError } from "shared";
import { createUser, findByEmail } from "../repositories/user.repo";
import { RegisterInput, LoginInput } from "../schemas/auth.schemas";
import { convertToPublicUser } from "../utils/auth.utils";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";

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
export async function login(input: LoginInput) {
  const user = await findByEmail(input.email);

  if (!user) throw new AppError("Invalid credentials!", 401);

  const passwordMatch = await bcrypt.compare(
    input.password,
    user.password_hash,
  );
  if (!passwordMatch) throw new AppError("Invalid credentials!", 401);

  const token = signToken({ userId: user.id, role: user.role });
  return {
    token,
    user: convertToPublicUser(user),
  };
}
