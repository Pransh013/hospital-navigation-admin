import bcrypt from "bcryptjs";
import { env } from "@/env/server";
import { jwtVerify, SignJWT } from "jose";
import { SALT_ROUNDS, TOKEN_EXPIRY_SECONDS } from "@/constants";
import { TokenPayload } from "./validations";

const secretKey = new TextEncoder().encode(env.JWT_SECRET);

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
