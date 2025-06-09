-- CreateTable
CREATE TABLE `tb_kelas_dosen` (
    `kelas_dosen_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tahun_akademik` VARCHAR(50) NOT NULL,
    `kelas` VARCHAR(50) NOT NULL,
    `dosen_id` INTEGER NOT NULL,
    `kelas_id` INTEGER NOT NULL,

    PRIMARY KEY (`kelas_dosen_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_dosen` (
    `dosen_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_dosen` VARCHAR(255) NOT NULL,
    `kode_dosen` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`dosen_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_mahasiswa` (
    `mahasiswa_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_mahasiswa` VARCHAR(255) NOT NULL,
    `nim_mahasiswa` VARCHAR(50) NOT NULL,
    `enroll_year` INTEGER NOT NULL,

    PRIMARY KEY (`mahasiswa_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_kelas` (
    `kelas_id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_kelas` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`kelas_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_question` (
    `question_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_question` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_tools_assessment` (
    `tool_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_tools` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`tool_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_nilai` (
    `nilai_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nilai_per_question` INTEGER NOT NULL,
    `percentage` DOUBLE NOT NULL,
    `percentage_clo` DOUBLE NOT NULL,
    `percentage_plo` DOUBLE NOT NULL,
    `input_by` VARCHAR(255) NOT NULL,
    `input_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `question_id` INTEGER NOT NULL,
    `tool_id` INTEGER NOT NULL,
    `mahasiswa_id` INTEGER NOT NULL,

    PRIMARY KEY (`nilai_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_kelas_dosen` ADD CONSTRAINT `tb_kelas_dosen_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `tb_dosen`(`dosen_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_kelas_dosen` ADD CONSTRAINT `tb_kelas_dosen_kelas_id_fkey` FOREIGN KEY (`kelas_id`) REFERENCES `tb_kelas`(`kelas_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_nilai` ADD CONSTRAINT `tb_nilai_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `tb_question`(`question_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_nilai` ADD CONSTRAINT `tb_nilai_tool_id_fkey` FOREIGN KEY (`tool_id`) REFERENCES `tb_tools_assessment`(`tool_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_nilai` ADD CONSTRAINT `tb_nilai_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `tb_mahasiswa`(`mahasiswa_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
