import { MigrationInterface, QueryRunner } from "typeorm";

export class DoctorAvailabilty1750831687533 implements MigrationInterface {
    name = 'DoctorAvailabilty1750831687533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "doctor_availabilities" ("id" SERIAL NOT NULL, "doctor_id" integer NOT NULL, "date" date NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "weekdays" character varying, "session" character varying, "doctorDoctorId" integer, CONSTRAINT "PK_2a42931ed0fe3c6934b737c503a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "doctor_time_slots" ("id" SERIAL NOT NULL, "doctor_id" integer NOT NULL, "date" date NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "is_available" boolean NOT NULL DEFAULT true, "doctorDoctorId" integer, CONSTRAINT "PK_63d5b22af8d0e2f639346cb7db0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "doctor_availabilities" ADD CONSTRAINT "FK_062ae0e0c7ff880b65f9bdf35a4" FOREIGN KEY ("doctorDoctorId") REFERENCES "doctor"("doctor_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctor_time_slots" ADD CONSTRAINT "FK_f7ea57d6d448b51797eb4fe9973" FOREIGN KEY ("doctorDoctorId") REFERENCES "doctor"("doctor_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_time_slots" DROP CONSTRAINT "FK_f7ea57d6d448b51797eb4fe9973"`);
        await queryRunner.query(`ALTER TABLE "doctor_availabilities" DROP CONSTRAINT "FK_062ae0e0c7ff880b65f9bdf35a4"`);
        await queryRunner.query(`DROP TABLE "doctor_time_slots"`);
        await queryRunner.query(`DROP TABLE "doctor_availabilities"`);
    }

}
