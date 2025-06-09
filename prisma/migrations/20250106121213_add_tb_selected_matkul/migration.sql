-- CreateTable
CREATE TABLE `tb_selected_matkul` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matkul_id` INTEGER NOT NULL,
    `selected` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_selected_matkul` ADD CONSTRAINT `tb_selected_matkul_matkul_id_fkey` FOREIGN KEY (`matkul_id`) REFERENCES `tb_matkul`(`matkul_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
