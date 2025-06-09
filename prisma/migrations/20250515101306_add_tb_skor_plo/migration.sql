-- CreateTable
CREATE TABLE `tb_skor_plo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plo_id` INTEGER NOT NULL,
    `skor` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tb_skor_plo_plo_id_key`(`plo_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_skor_plo` ADD CONSTRAINT `tb_skor_plo_plo_id_fkey` FOREIGN KEY (`plo_id`) REFERENCES `tb_plo`(`plo_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
