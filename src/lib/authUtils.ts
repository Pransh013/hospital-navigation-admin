import bcrypt from "bcryptjs";
import { env } from "@/env/server";
import Admin from "@/models/admin";
import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = env.JWT_SECRET;
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 * 7;

type TokenPayload = Pick<Admin, "adminId" | "email" | "hospitalId">;

const secretKey = new TextEncoder().encode(JWT_SECRET);

export const generateToken = async (user: TokenPayload): Promise<string> => {
  return await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${TOKEN_EXPIRY_SECONDS}s`)
    .setIssuedAt()
    .sign(secretKey);
};

export const verifyToken = async (token: string): Promise<TokenPayload> => {
  const { payload } = await jwtVerify(token, secretKey);
  return payload as TokenPayload;
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const isValidPassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
