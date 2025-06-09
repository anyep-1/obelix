-- CreateTable
CREATE TABLE `tb_plo` (
    `plo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_plo` VARCHAR(255) NOT NULL,
    `kurikulum_id` INTEGER NOT NULL,

    UNIQUE INDEX `tb_plo_plo_id_kurikulum_id_key`(`plo_id`, `kurikulum_id`),
    PRIMARY KEY (`plo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_plo` ADD CONSTRAINT `tb_plo_kurikulum_id_fkey` FOREIGN KEY (`kurikulum_id`) REFERENCES `tb_kurikulum`(`kurikulum_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
