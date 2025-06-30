import { MigrationInterface, QueryRunner } from "typeorm";

export class Userwith0auth1750497791216 implements MigrationInterface {
    name = 'Userwith0auth1750497791216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "specialization"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "provider" character varying NOT NULL DEFAULT 'local'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "provider"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "specialization" character varying`);
    }

}
