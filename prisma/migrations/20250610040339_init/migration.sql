-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Kaprodi', 'DosenKoor', 'DosenAmpu', 'GugusKendaliMutu', 'Evaluator');

-- CreateTable
CREATE TABLE "tb_kurikulum" (
    "kurikulum_id" SERIAL NOT NULL,
    "tahun_kurikulum" TEXT NOT NULL,

    CONSTRAINT "tb_kurikulum_pkey" PRIMARY KEY ("kurikulum_id")
);

-- CreateTable
CREATE TABLE "tb_profillulusan" (
    "profil_id" SERIAL NOT NULL,
    "deskripsi_profil" VARCHAR(255) NOT NULL,
    "kurikulum_id" INTEGER NOT NULL,

    CONSTRAINT "tb_profillulusan_pkey" PRIMARY KEY ("profil_id")
);

-- CreateTable
CREATE TABLE "tb_plo" (
    "plo_id" SERIAL NOT NULL,
    "nama_plo" VARCHAR(1000) NOT NULL,
    "kurikulum_id" INTEGER NOT NULL,
    "nomor_plo" VARCHAR(50),

    CONSTRAINT "tb_plo_pkey" PRIMARY KEY ("plo_id")
);

-- CreateTable
CREATE TABLE "tb_matkul" (
    "matkul_id" SERIAL NOT NULL,
    "nama_matkul" VARCHAR(255) NOT NULL,
    "kode_matkul" VARCHAR(11) NOT NULL,
    "jumlah_sks" INTEGER NOT NULL,
    "kurikulum_id" INTEGER NOT NULL,
    "tingkat" VARCHAR(50) NOT NULL,
    "semester" VARCHAR(50) NOT NULL,

    CONSTRAINT "tb_matkul_pkey" PRIMARY KEY ("matkul_id")
);

-- CreateTable
CREATE TABLE "tb_plo_profil" (
    "id" SERIAL NOT NULL,
    "plo_id" INTEGER NOT NULL,
    "profil_id" INTEGER NOT NULL,

    CONSTRAINT "tb_plo_profil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_pi" (
    "pi_id" SERIAL NOT NULL,
    "deskripsi_pi" TEXT NOT NULL,
    "plo_id" INTEGER NOT NULL,
    "nomor_pi" VARCHAR(50),

    CONSTRAINT "tb_pi_pkey" PRIMARY KEY ("pi_id")
);

-- CreateTable
CREATE TABLE "tb_clo" (
    "clo_id" SERIAL NOT NULL,
    "nama_clo" VARCHAR(255) NOT NULL,
    "plo_id" INTEGER NOT NULL,
    "pi_id" INTEGER NOT NULL,
    "matkul_id" INTEGER NOT NULL,
    "nomor_clo" VARCHAR(50),

    CONSTRAINT "tb_clo_pkey" PRIMARY KEY ("clo_id")
);

-- CreateTable
CREATE TABLE "tb_kelas_dosen" (
    "kelas_dosen_id" SERIAL NOT NULL,
    "tahun_akademik" VARCHAR(50) NOT NULL,
    "kelas" VARCHAR(50) NOT NULL,
    "dosen_id" INTEGER NOT NULL,
    "matkul_id" INTEGER NOT NULL,

    CONSTRAINT "tb_kelas_dosen_pkey" PRIMARY KEY ("kelas_dosen_id")
);

-- CreateTable
CREATE TABLE "tb_dosen" (
    "dosen_id" SERIAL NOT NULL,
    "nama_dosen" VARCHAR(255) NOT NULL,
    "kode_dosen" VARCHAR(50) NOT NULL,

    CONSTRAINT "tb_dosen_pkey" PRIMARY KEY ("dosen_id")
);

-- CreateTable
CREATE TABLE "tb_mahasiswa" (
    "mahasiswa_id" SERIAL NOT NULL,
    "nama_mahasiswa" VARCHAR(255) NOT NULL,
    "nim_mahasiswa" VARCHAR(50) NOT NULL,
    "enroll_year" INTEGER NOT NULL,
    "kelas_id" INTEGER NOT NULL,

    CONSTRAINT "tb_mahasiswa_pkey" PRIMARY KEY ("mahasiswa_id")
);

-- CreateTable
CREATE TABLE "tb_kelas" (
    "kelas_id" SERIAL NOT NULL,
    "kode_kelas" VARCHAR(50) NOT NULL,

    CONSTRAINT "tb_kelas_pkey" PRIMARY KEY ("kelas_id")
);

-- CreateTable
CREATE TABLE "tb_question" (
    "question_id" SERIAL NOT NULL,
    "nama_question" VARCHAR(255) NOT NULL,
    "clo_id" INTEGER NOT NULL,
    "tool_id" INTEGER NOT NULL,

    CONSTRAINT "tb_question_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "tb_tools_assessment" (
    "tool_id" SERIAL NOT NULL,
    "nama_tools" VARCHAR(255) NOT NULL,

    CONSTRAINT "tb_tools_assessment_pkey" PRIMARY KEY ("tool_id")
);

-- CreateTable
CREATE TABLE "tb_nilai" (
    "nilai_id" SERIAL NOT NULL,
    "nilai_per_question" INTEGER NOT NULL,
    "input_by" VARCHAR(255) NOT NULL,
    "input_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question_id" INTEGER NOT NULL,
    "mahasiswa_id" INTEGER NOT NULL,
    "clo_id" INTEGER NOT NULL,
    "matkul_id" INTEGER NOT NULL,

    CONSTRAINT "tb_nilai_pkey" PRIMARY KEY ("nilai_id")
);

-- CreateTable
CREATE TABLE "tb_selected_matkul" (
    "id" SERIAL NOT NULL,
    "matkul_id" INTEGER NOT NULL,
    "selected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_selected_matkul_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_template_rubrik" (
    "template_id" SERIAL NOT NULL,
    "kurikulum_id" INTEGER NOT NULL,
    "matkul_id" INTEGER NOT NULL,
    "plo_id" INTEGER NOT NULL,
    "pi_id" INTEGER NOT NULL,
    "ta_semester" VARCHAR(50) NOT NULL,
    "dosen_pengampu" JSONB NOT NULL,
    "objek_pengukuran" TEXT NOT NULL,
    "rubrik_kategori" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_template_rubrik_pkey" PRIMARY KEY ("template_id")
);

-- CreateTable
CREATE TABLE "tb_user" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "nama" VARCHAR(100) NOT NULL DEFAULT 'Unknown',
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "tb_skor_clo" (
    "id" SERIAL NOT NULL,
    "clo_id" INTEGER NOT NULL,
    "template_id" INTEGER NOT NULL,
    "skor" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_skor_clo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_skor_pi" (
    "id" SERIAL NOT NULL,
    "pi_id" INTEGER NOT NULL,
    "skor" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_skor_pi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_skor_plo" (
    "id" SERIAL NOT NULL,
    "plo_id" INTEGER NOT NULL,
    "skor" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_skor_plo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_monev" (
    "monev_id" SERIAL NOT NULL,
    "programStudi" VARCHAR(100) NOT NULL,
    "tanggalRTM" TIMESTAMP(3) NOT NULL,
    "tanggalMonev" TIMESTAMP(3) NOT NULL,
    "evaluasiPeriode" VARCHAR(100) NOT NULL,
    "tujuanEvaluasi" TEXT NOT NULL,
    "metodeEvaluasi" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "linkBukti" TEXT,
    "userTujuanId" INTEGER NOT NULL,
    "userPembuatId" INTEGER NOT NULL,
    "matkul_id" INTEGER NOT NULL,

    CONSTRAINT "tb_monev_pkey" PRIMARY KEY ("monev_id")
);

-- CreateTable
CREATE TABLE "tb_rt" (
    "rt_id" SERIAL NOT NULL,
    "deskripsiRT" TEXT NOT NULL,
    "statusImplementasi" TEXT NOT NULL DEFAULT 'belum',
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3) NOT NULL,
    "analisisKetercapaian" TEXT NOT NULL,
    "kendala" TEXT NOT NULL,
    "solusi" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monev_id" INTEGER NOT NULL,

    CONSTRAINT "tb_rt_pkey" PRIMARY KEY ("rt_id")
);

-- CreateTable
CREATE TABLE "tb_portofolio" (
    "id" SERIAL NOT NULL,
    "kurikulum_id" INTEGER NOT NULL,
    "tahun_akademik" TEXT NOT NULL,
    "matkul_id" INTEGER NOT NULL,
    "kelas_id" INTEGER NOT NULL,
    "link_drive" TEXT,

    CONSTRAINT "tb_portofolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_nilai_minimum" (
    "id" SERIAL NOT NULL,
    "nilai_minimum" DOUBLE PRECISION NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_nilai_minimum_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_plo_profil_plo_id_profil_id_key" ON "tb_plo_profil"("plo_id", "profil_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_pi_plo_id_pi_id_key" ON "tb_pi"("plo_id", "pi_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_clo_plo_id_clo_id_key" ON "tb_clo"("plo_id", "clo_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_clo_pi_id_clo_id_key" ON "tb_clo"("pi_id", "clo_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_clo_matkul_id_clo_id_key" ON "tb_clo"("matkul_id", "clo_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_dosen_kode_dosen_key" ON "tb_dosen"("kode_dosen");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_username_key" ON "tb_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "tb_skor_clo_clo_id_template_id_key" ON "tb_skor_clo"("clo_id", "template_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_skor_pi_pi_id_key" ON "tb_skor_pi"("pi_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_skor_plo_plo_id_key" ON "tb_skor_plo"("plo_id");

-- AddForeignKey
ALTER TABLE "tb_profillulusan" ADD CONSTRAINT "tb_profillulusan_kurikulum_id_fkey" FOREIGN KEY ("kurikulum_id") REFERENCES "tb_kurikulum"("kurikulum_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_plo" ADD CONSTRAINT "tb_plo_kurikulum_id_fkey" FOREIGN KEY ("kurikulum_id") REFERENCES "tb_kurikulum"("kurikulum_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_matkul" ADD CONSTRAINT "tb_matkul_kurikulum_id_fkey" FOREIGN KEY ("kurikulum_id") REFERENCES "tb_kurikulum"("kurikulum_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_plo_profil" ADD CONSTRAINT "tb_plo_profil_plo_id_fkey" FOREIGN KEY ("plo_id") REFERENCES "tb_plo"("plo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_plo_profil" ADD CONSTRAINT "tb_plo_profil_profil_id_fkey" FOREIGN KEY ("profil_id") REFERENCES "tb_profillulusan"("profil_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_pi" ADD CONSTRAINT "tb_pi_plo_id_fkey" FOREIGN KEY ("plo_id") REFERENCES "tb_plo"("plo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_clo" ADD CONSTRAINT "tb_clo_matkul_id_fkey" FOREIGN KEY ("matkul_id") REFERENCES "tb_matkul"("matkul_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_clo" ADD CONSTRAINT "tb_clo_pi_id_fkey" FOREIGN KEY ("pi_id") REFERENCES "tb_pi"("pi_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_clo" ADD CONSTRAINT "tb_clo_plo_id_fkey" FOREIGN KEY ("plo_id") REFERENCES "tb_plo"("plo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_kelas_dosen" ADD CONSTRAINT "tb_kelas_dosen_dosen_id_fkey" FOREIGN KEY ("dosen_id") REFERENCES "tb_dosen"("dosen_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_kelas_dosen" ADD CONSTRAINT "tb_kelas_dosen_matkul_id_fkey" FOREIGN KEY ("matkul_id") REFERENCES "tb_matkul"("matkul_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_mahasiswa" ADD CONSTRAINT "tb_mahasiswa_kelas_id_fkey" FOREIGN KEY ("kelas_id") REFERENCES "tb_kelas"("kelas_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_question" ADD CONSTRAINT "tb_question_clo_id_fkey" FOREIGN KEY ("clo_id") REFERENCES "tb_clo"("clo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_question" ADD CONSTRAINT "tb_question_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tb_tools_assessment"("tool_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_nilai" ADD CONSTRAINT "tb_nilai_clo_id_fkey" FOREIGN KEY ("clo_id") REFERENCES "tb_clo"("clo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_nilai" ADD CONSTRAINT "tb_nilai_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "tb_mahasiswa"("mahasiswa_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_nilai" ADD CONSTRAINT "tb_nilai_matkul_id_fkey" FOREIGN KEY ("matkul_id") REFERENCES "tb_matkul"("matkul_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_nilai" ADD CONSTRAINT "tb_nilai_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "tb_question"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_selected_matkul" ADD CONSTRAINT "tb_selected_matkul_matkul_id_fkey" FOREIGN KEY ("matkul_id") REFERENCES "tb_matkul"("matkul_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_template_rubrik" ADD CONSTRAINT "tb_template_rubrik_kurikulum_id_fkey" FOREIGN KEY ("kurikulum_id") REFERENCES "tb_kurikulum"("kurikulum_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_template_rubrik" ADD CONSTRAINT "tb_template_rubrik_matkul_id_fkey" FOREIGN KEY ("matkul_id") REFERENCES "tb_matkul"("matkul_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_template_rubrik" ADD CONSTRAINT "tb_template_rubrik_pi_id_fkey" FOREIGN KEY ("pi_id") REFERENCES "tb_pi"("pi_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_template_rubrik" ADD CONSTRAINT "tb_template_rubrik_plo_id_fkey" FOREIGN KEY ("plo_id") REFERENCES "tb_plo"("plo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_skor_clo" ADD CONSTRAINT "tb_skor_clo_clo_id_fkey" FOREIGN KEY ("clo_id") REFERENCES "tb_clo"("clo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_skor_clo" ADD CONSTRAINT "tb_skor_clo_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "tb_template_rubrik"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_skor_pi" ADD CONSTRAINT "tb_skor_pi_pi_id_fkey" FOREIGN KEY ("pi_id") REFERENCES "tb_pi"("pi_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_skor_plo" ADD CONSTRAINT "tb_skor_plo_plo_id_fkey" FOREIGN KEY ("plo_id") REFERENCES "tb_plo"("plo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_monev" ADD CONSTRAINT "tb_monev_matkul_id_fkey" FOREIGN KEY ("matkul_id") REFERENCES "tb_matkul"("matkul_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_monev" ADD CONSTRAINT "tb_monev_userPembuatId_fkey" FOREIGN KEY ("userPembuatId") REFERENCES "tb_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_monev" ADD CONSTRAINT "tb_monev_userTujuanId_fkey" FOREIGN KEY ("userTujuanId") REFERENCES "tb_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_rt" ADD CONSTRAINT "tb_rt_monev_id_fkey" FOREIGN KEY ("monev_id") REFERENCES "tb_monev"("monev_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_portofolio" ADD CONSTRAINT "tb_portofolio_kelas_id_fkey" FOREIGN KEY ("kelas_id") REFERENCES "tb_kelas"("kelas_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_portofolio" ADD CONSTRAINT "tb_portofolio_kurikulum_id_fkey" FOREIGN KEY ("kurikulum_id") REFERENCES "tb_kurikulum"("kurikulum_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_portofolio" ADD CONSTRAINT "tb_portofolio_matkul_id_fkey" FOREIGN KEY ("matkul_id") REFERENCES "tb_matkul"("matkul_id") ON DELETE RESTRICT ON UPDATE CASCADE;
