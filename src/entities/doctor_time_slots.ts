import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctor } from './Doctor';

@Entity('doctor_time_slots')
export class DoctorTimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  doctor_id: number;

  @ManyToOne(() => Doctor)
  doctor: Doctor;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @Column({ default: true })
  is_available: boolean;
}