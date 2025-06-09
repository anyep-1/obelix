import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

// Named export for DELETE method
export async function DELETE(req) {
  try {
    const deletedCount = await prisma.tb_selected_matkul.deleteMany({});
    if (deletedCount.count > 0) {
      return new Response(
        JSON.stringify({
          message: "Semua pilihan mata kuliah berhasil direset!",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Tidak ada data untuk dihapus." }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error resetting data:", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan saat mereset data." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
