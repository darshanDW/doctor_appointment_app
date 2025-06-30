import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctor } from './Doctor';

@Entity('doctor_availabilities')
export class DoctorAvailability {
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

  @Column({ type: 'varchar', nullable: true })
  weekdays: string; // e.g. "Mon,Tue,Wed"

  @Column({ type: 'varchar', nullable: true })
  session: string; // e.g. "Morning" or "Evening"
}