-- CreateTable
CREATE TABLE `tb_kurikulum` (
    `kurikulum_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tahun_kurikulum` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`kurikulum_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_profillulusan` (
    `profil_id` INTEGER NOT NULL AUTO_INCREMENT,
    `deskripsi_profil` VARCHAR(255) NOT NULL,
    `kurikulum_id` INTEGER NOT NULL,

    UNIQUE INDEX `tb_profillulusan_profil_id_kurikulum_id_key`(`profil_id`, `kurikulum_id`),
    PRIMARY KEY (`profil_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_profillulusan` ADD CONSTRAINT `tb_profillulusan_kurikulum_id_fkey` FOREIGN KEY (`kurikulum_id`) REFERENCES `tb_kurikulum`(`kurikulum_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
