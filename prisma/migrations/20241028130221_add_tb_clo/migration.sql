-- CreateTable
CREATE TABLE `tb_clo` (
    `clo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_clo` VARCHAR(255) NOT NULL,
    `plo_id` INTEGER NOT NULL,
    `pi_id` INTEGER NOT NULL,
    `matkul_id` INTEGER NOT NULL,

    UNIQUE INDEX `tb_clo_plo_id_clo_id_key`(`plo_id`, `clo_id`),
    UNIQUE INDEX `tb_clo_pi_id_clo_id_key`(`pi_id`, `clo_id`),
    UNIQUE INDEX `tb_clo_matkul_id_clo_id_key`(`matkul_id`, `clo_id`),
    PRIMARY KEY (`clo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_clo` ADD CONSTRAINT `tb_clo_plo_id_fkey` FOREIGN KEY (`plo_id`) REFERENCES `tb_plo`(`plo_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_clo` ADD CONSTRAINT `tb_clo_pi_id_fkey` FOREIGN KEY (`pi_id`) REFERENCES `tb_pi`(`pi_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_clo` ADD CONSTRAINT `tb_clo_matkul_id_fkey` FOREIGN KEY (`matkul_id`) REFERENCES `tb_matkul`(`matkul_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
