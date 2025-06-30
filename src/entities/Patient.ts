import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Appointment } from "./Appointment";

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  patient_id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone_number: string;

  @Column()
  gender: string;

  @Column()
  dob: Date;

  @Column()
  address: string;

  @Column()
  emergency_contact: string;

  @Column()
  medical_history: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];
}