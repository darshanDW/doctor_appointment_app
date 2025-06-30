
import "reflect-metadata";  
import { DataSource, DeleteDateColumn } from "typeorm";
import { Doctor } from "./entities/Doctor";
import { Patient } from "./entities/Patient";
import { Appointment } from "./entities/Appointment";
import {TimeSlot} from "./entities/TimeSlot"
import { User } from "./entities/User";
import 'dotenv/config'; 
import { DoctorAvailability} from "./entities/Doctor_availabilities";
import { DoctorTimeSlot } from "./entities/doctor_time_slots";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "rating_8kmo",
  synchronize: false,
   ssl: {
    rejectUnauthorized: false, 
  },
  logging: true,
  entities: [Doctor, Patient, Appointment, TimeSlot,User,DoctorAvailability,DoctorTimeSlot],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
