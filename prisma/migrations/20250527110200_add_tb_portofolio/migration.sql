-- CreateTable
CREATE TABLE `tb_portofolio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kurikulum_id` INTEGER NOT NULL,
    `tahun_akademik` VARCHAR(191) NOT NULL,
    `matkul_id` INTEGER NOT NULL,
    `kelas_id` INTEGER NOT NULL,
    `link_drive` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_portofolio` ADD CONSTRAINT `tb_portofolio_kurikulum_id_fkey` FOREIGN KEY (`kurikulum_id`) REFERENCES `tb_kurikulum`(`kurikulum_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_portofolio` ADD CONSTRAINT `tb_portofolio_matkul_id_fkey` FOREIGN KEY (`matkul_id`) REFERENCES `tb_matkul`(`matkul_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_portofolio` ADD CONSTRAINT `tb_portofolio_kelas_id_fkey` FOREIGN KEY (`kelas_id`) REFERENCES `tb_kelas`(`kelas_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
