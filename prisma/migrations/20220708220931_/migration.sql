/*
  Warnings:

  - You are about to alter the column `cnpj` on the `Empresa` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(14)`.
  - You are about to drop the column `admin` on the `Usuario` table. All the data in the column will be lost.
  - You are about to alter the column `cpf` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(11)`.

*/
-- AlterTable
ALTER TABLE "Empresa" ALTER COLUMN "cnpj" SET DATA TYPE VARCHAR(14);

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "admin",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "cpf" SET DATA TYPE VARCHAR(11);
