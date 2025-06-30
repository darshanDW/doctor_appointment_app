import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  password?: string; // null for Google users

  @Column({ default: 'local' })
  provider: 'local' | 'google';

  @Column()
  role: 'doctor' | 'patient';

  @Column({ nullable: true })
  refreshToken?: string;
}