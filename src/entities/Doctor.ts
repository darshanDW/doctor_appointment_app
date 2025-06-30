import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Appointment } from "./Appointment";
import { TimeSlot } from "./TimeSlot";
@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  doctor_id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone_number: string;

  @Column()
  specialization: string;

  @Column()
  experience_years: number;

  @Column()
  education: string;

  @Column()
  clinic_name: string;

  @Column()
  clinic_address: string;

  @Column()
  available_days: string;

  @Column()
  available_time_slots: string;

  @Column({ default: 'stream' })
  schedule_Type: 'stream' | 'wave';
  
  @Column() // <-- Add this for authentication
  password: string;


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.doctor)
  timeSlots: TimeSlot[];
  @Column({ nullable: true })
refreshToken?: string;
}