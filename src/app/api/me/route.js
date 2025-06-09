import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function GET() {
  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Decode JWT
    const decoded = jwt.verify(token, SECRET_KEY);

    return NextResponse.json({
      authenticated: true,
      user: {
        user_id: decoded.user_id,
        username: decoded.username,
        role: decoded.role,
        nama: decoded.nama,
      },
    });
  } catch (error) {
    console.error("⛔ Gagal verifikasi token:", error.message);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
