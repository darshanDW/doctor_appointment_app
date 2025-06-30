import { MigrationInterface, QueryRunner } from "typeorm";

export class AddScheduleTypeToDoctor1751090437224 implements MigrationInterface {
    name = 'AddScheduleTypeToDoctor1751090437224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor" ADD "schedule_Type" character varying NOT NULL DEFAULT 'stream'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor" DROP COLUMN "schedule_Type"`);
    }

}
