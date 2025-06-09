-- CreateTable
CREATE TABLE `tb_template_rubrik` (
    `template_id` INTEGER NOT NULL AUTO_INCREMENT,
    `kurikulum_id` INTEGER NOT NULL,
    `matkul_id` INTEGER NOT NULL,
    `plo_id` INTEGER NOT NULL,
    `pi_id` INTEGER NOT NULL,
    `ta_semester` VARCHAR(50) NOT NULL,
    `dosen_pengampu` TEXT NOT NULL,
    `objek_pengukuran` TEXT NOT NULL,
    `rubrik_kategori` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`template_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_template_rubrik` ADD CONSTRAINT `tb_template_rubrik_kurikulum_id_fkey` FOREIGN KEY (`kurikulum_id`) REFERENCES `tb_kurikulum`(`kurikulum_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_template_rubrik` ADD CONSTRAINT `tb_template_rubrik_matkul_id_fkey` FOREIGN KEY (`matkul_id`) REFERENCES `tb_matkul`(`matkul_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_template_rubrik` ADD CONSTRAINT `tb_template_rubrik_plo_id_fkey` FOREIGN KEY (`plo_id`) REFERENCES `tb_plo`(`plo_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_template_rubrik` ADD CONSTRAINT `tb_template_rubrik_pi_id_fkey` FOREIGN KEY (`pi_id`) REFERENCES `tb_pi`(`pi_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
