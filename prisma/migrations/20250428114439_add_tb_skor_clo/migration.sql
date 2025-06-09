-- CreateTable
CREATE TABLE `tb_skor_clo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clo_id` INTEGER NOT NULL,
    `skor` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_skor_clo` ADD CONSTRAINT `tb_skor_clo_clo_id_fkey` FOREIGN KEY (`clo_id`) REFERENCES `tb_clo`(`clo_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
