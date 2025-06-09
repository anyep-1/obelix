-- CreateTable
CREATE TABLE `tb_plo_profil` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plo_id` INTEGER NOT NULL,
    `profil_id` INTEGER NOT NULL,

    UNIQUE INDEX `tb_plo_profil_plo_id_profil_id_key`(`plo_id`, `profil_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_plo_profil` ADD CONSTRAINT `tb_plo_profil_plo_id_fkey` FOREIGN KEY (`plo_id`) REFERENCES `tb_plo`(`plo_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_plo_profil` ADD CONSTRAINT `tb_plo_profil_profil_id_fkey` FOREIGN KEY (`profil_id`) REFERENCES `tb_profillulusan`(`profil_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
