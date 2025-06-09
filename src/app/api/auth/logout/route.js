import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // 🔥 Hapus token dari cookie
    cookies().set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0), // Set waktu kadaluarsa ke masa lalu
    });

    return NextResponse.json({ message: "Logout berhasil!" }, { status: 200 });
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat logout!" },
      { status: 500 }
    );
  }
}
