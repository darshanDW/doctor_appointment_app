import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Doctor } from '../entities/Doctor';
import { BadRequestException } from '@nestjs/common';
import { Connection } from 'typeorm';
import { DoctorAvailability } from 'src/entities/Doctor_availabilities';
import { DoctorTimeSlot } from 'src/entities/doctor_time_slots';
@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
    private readonly connection: Connection,
    @InjectRepository(DoctorAvailability)
    private readonly doctorAvailabilityRepo: Repository<DoctorAvailability>,
    @InjectRepository(DoctorTimeSlot)
    private readonly doctorTimeSlotRepo: Repository<DoctorTimeSlot>,
  ) {}
  

  async listDoctors(first_name?: string, specialization?: string) {
    const where: any = {};
    if (first_name) where.first_name = ILike(`%${first_name}%`);
    if (specialization) where.specialization = ILike(`%${specialization}%`);
    return this.doctorRepo.find({ where });
  }

  async getDoctorById(id: string) {
    return this.doctorRepo.findOne({ where: { doctor_id: Number(id) } });
  }

  async setDoctorAvailability(
  doctorId: number,
  body: { date: string; start_time: string; end_time: string; weekdays: string[]; session: string }
) {
  // 1. Validate date is not in the past
  const today = new Date();
  const inputDate = new Date(body.date);
  if (inputDate < today) throw new BadRequestException('Date cannot be in the past');

  // 2. Save to doctor_availabilities table
  const availability = await this.doctorAvailabilityRepo.save({
    doctor_id: doctorId,
    date: body.date,
    start_time: body.start_time,
    end_time: body.end_time,
    weekdays: body.weekdays.join(','),
    session: body.session,
  });

  // 3. Divide time intervals and store in doctor_time_slots table
  const slotRepo = this.doctorTimeSlotRepo;
  const slots: DoctorTimeSlot[] = [];
  let current = body.start_time;
  while (current < body.end_time) {
    // Example: 30 min slots
    const next = this.addMinutes(current, 30);
    // Prevent duplicate slots
    const exists = await slotRepo.findOne({
      where: {
        doctor_id: doctorId,
        date: body.date,
        start_time: current,
        end_time: next,
      },
    });
    if (!exists) {
      slots.push(
        slotRepo.create({
          doctor_id: doctorId,
          date: body.date,
          start_time: current,
          end_time: next,
          is_available: true,
        } as Partial<DoctorTimeSlot>)
      );
    }
    current = next;
  }
  await slotRepo.save(slots);
  return { message: 'Availability set', slotsCreated: slots.length };
}

// Helper method to add minutes to a time string "HH:mm"
private addMinutes(time: string, minsToAdd: number): string {
  const [h, m] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m + minsToAdd, 0, 0);
  return date.toTimeString().slice(0, 5);
}


async updateScheduleType(doctorId: number, schedule_Type: 'stream' | 'wave') {
  const doctor = await this.doctorRepo.findOne({ where: { doctor_id: doctorId } });
  if (!doctor) throw new BadRequestException('Doctor not found');
  doctor.schedule_Type = schedule_Type;
  await this.doctorRepo.save(doctor);
  return { message: 'Schedule type updated', schedule_Type };
}
}