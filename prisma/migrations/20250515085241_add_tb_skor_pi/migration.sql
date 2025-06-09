-- CreateTable
CREATE TABLE `tb_skor_pi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pi_id` INTEGER NOT NULL,
    `skor` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_skor_pi` ADD CONSTRAINT `tb_skor_pi_pi_id_fkey` FOREIGN KEY (`pi_id`) REFERENCES `tb_pi`(`pi_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
