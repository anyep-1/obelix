-- CreateTable
CREATE TABLE `tb_matkul` (
    `matkul_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_matkul` VARCHAR(255) NOT NULL,
    `kode_matkul` VARCHAR(11) NOT NULL,
    `jumlah_sks` INTEGER NOT NULL,
    `kurikulum_id` INTEGER NOT NULL,

    UNIQUE INDEX `tb_matkul_matkul_id_kurikulum_id_key`(`matkul_id`, `kurikulum_id`),
    PRIMARY KEY (`matkul_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_matkul` ADD CONSTRAINT `tb_matkul_kurikulum_id_fkey` FOREIGN KEY (`kurikulum_id`) REFERENCES `tb_kurikulum`(`kurikulum_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
