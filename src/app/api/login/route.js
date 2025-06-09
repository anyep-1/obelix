import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req) {
  try {
    const body = await req.json();
    let { username, password, role } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username dan password harus diisi!" },
        { status: 400 }
      );
    }

    // Otomatis tetapkan role Admin jika username = admin
    if (username === "admin") {
      role = "Admin";
    }

    if (!role) {
      return NextResponse.json(
        { message: "Role harus dipilih!" },
        { status: 400 }
      );
    }

    const user = await prisma.tb_user.findUnique({
      where: { username },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "Username atau password salah!" },
        { status: 401 }
      );
    }

    if (user.role !== role) {
      return NextResponse.json(
        { message: "Role tidak sesuai!" },
        { status: 403 }
      );
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
        nama: user.nama,
      },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json(
      {
        message: "Login berhasil!",
        user: {
          user_id: user.user_id,
          username: user.username,
          role: user.role,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat login!" },
      { status: 500 }
    );
  }
}
