import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export function getUserFromToken() {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return null;

    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}
