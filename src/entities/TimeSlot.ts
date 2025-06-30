import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Doctor } from "../entities/Doctor";

@Entity()
export class TimeSlot {
  @PrimaryGeneratedColumn()
  slot_id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.timeSlots, { onDelete: "CASCADE" })
  doctor: Doctor;

  @Column()
  day_of_week: string;

  @Column()
  start_time: string;

  @Column()
  end_time: string;
}