import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";
import { Doctor } from "./Doctor";
import { Patient } from "./Patient";

@Entity()
@Unique(["doctor", "appointment_date", "time_slot"])
@Unique(["patient", "appointment_date", "time_slot"])
export class Appointment {
  @PrimaryGeneratedColumn()
  appointment_id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, { onDelete: "CASCADE" })
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.appointments, { onDelete: "CASCADE" })
  patient: Patient;

  @Column()
  appointment_date: Date;

  @Column()
  time_slot: string;

  @Column()
  appointment_status: string;

  @Column()
  reason: string;

  @Column()
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}