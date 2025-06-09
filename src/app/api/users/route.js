import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const roleFilter = searchParams.get("role");

    let users;

    if (roleFilter === "tujuan") {
      users = await prisma.tb_user.findMany({
        where: {
          role: {
            in: ["DosenKoor", "DosenAmpu"],
          },
        },
        select: { user_id: true, nama: true },
      });
    } else {
      users = await prisma.tb_user.findMany({
        select: { user_id: true, username: true, role: true, nama: true },
      });
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data pengguna" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password, role, nama } = body;

    if (!username || !password || !role || !nama) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.tb_user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "Username sudah digunakan" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.tb_user.create({
      data: { username, password: hashedPassword, role, nama },
    });

    return NextResponse.json(
      {
        message: "User berhasil ditambahkan",
        user: {
          user_id: newUser.user_id,
          username: newUser.username,
          role: newUser.role,
          nama: newUser.nama,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json(
      { message: "Gagal menambahkan user" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { user_id, username, password, role, nama } = body;

    if (!user_id || !username || !role || !nama) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    let updateData = { username, role, nama };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.tb_user.update({
      where: { user_id },
      data: updateData,
    });

    return NextResponse.json(
      {
        message: "User berhasil diperbarui",
        user: {
          user_id: updatedUser.user_id,
          username: updatedUser.username,
          role: updatedUser.role,
          nama: updatedUser.nama,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json(
        { message: "User ID tidak ditemukan" },
        { status: 400 }
      );
    }

    await prisma.tb_user.delete({ where: { user_id } });

    return NextResponse.json(
      { message: "User berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Gagal menghapus user" },
      { status: 500 }
    );
  }
}
