-- AlterTable
ALTER TABLE `tb_user` ADD COLUMN `nama` VARCHAR(100) NOT NULL DEFAULT 'Unknown';

-- CreateTable
CREATE TABLE `tb_monev` (
    `monev_id` INTEGER NOT NULL AUTO_INCREMENT,
    `programStudi` VARCHAR(100) NOT NULL,
    `tanggalRTM` DATETIME(3) NOT NULL,
    `tanggalMonev` DATETIME(3) NOT NULL,
    `evaluasiPeriode` VARCHAR(100) NOT NULL,
    `tujuanEvaluasi` VARCHAR(191) NOT NULL,
    `metodeEvaluasi` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userTujuanId` INTEGER NOT NULL,

    PRIMARY KEY (`monev_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_rt` (
    `rt_id` INTEGER NOT NULL AUTO_INCREMENT,
    `deskripsiRT` VARCHAR(191) NOT NULL,
    `statusImplementasi` VARCHAR(191) NOT NULL,
    `tanggalMulai` DATETIME(3) NOT NULL,
    `tanggalSelesai` DATETIME(3) NOT NULL,
    `analisisKetercapaian` VARCHAR(191) NOT NULL,
    `kendala` VARCHAR(191) NOT NULL,
    `solusi` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `monev_id` INTEGER NOT NULL,

    PRIMARY KEY (`rt_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_monev` ADD CONSTRAINT `tb_monev_userTujuanId_fkey` FOREIGN KEY (`userTujuanId`) REFERENCES `tb_user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_rt` ADD CONSTRAINT `tb_rt_monev_id_fkey` FOREIGN KEY (`monev_id`) REFERENCES `tb_monev`(`monev_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
