import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from '../entities/Appointment';
import { Doctor } from '../entities/Doctor';
import { DoctorTimeSlot } from '../entities/doctor_time_slots';
import { Repository } from 'typeorm';
import { Patient } from 'src/entities/Patient';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
    @InjectRepository(DoctorTimeSlot)
    private slotRepo: Repository<DoctorTimeSlot>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  async bookAppointment(
    body: { doctor_id: number; date: string; start_time: string; end_time: string; },
    patientemail : string
  ) {
    const doctor = await this.doctorRepo.findOne({ where: { doctor_id: body.doctor_id } });
    if (!doctor) throw new BadRequestException('Doctor not found');
const patient = await this.patientRepo.findOne({ where: {email : patientemail } });
if (!patient) throw new BadRequestException('Patient not found');

    // Find the slot
    const slot = await this.slotRepo.findOne({
      where: {
        doctor_id: body.doctor_id,
        date: body.date,
        start_time: body.start_time,
        end_time: body.end_time,
      },
    });
    if (!slot) throw new BadRequestException('Slot not found');

    if (doctor.schedule_Type === 'stream') {
      if (!slot.is_available) throw new ConflictException('Slot already booked');
      // Book appointment
      await this.appointmentRepo.save({
        doctor: doctor,
        patient: patient,
        appointment_date: body.date,
        time_slot: `${body.start_time}-${body.end_time}`,
        appointment_status: 'booked',
        reason: '',
        notes: '',
      });
      slot.is_available = false;
      await this.slotRepo.save(slot);
      return { message: 'Appointment booked (stream)' };
    } else if (doctor.schedule_Type === 'wave') {
      // Count existing appointments for this slot
      const count = await this.appointmentRepo.count({
        where: {
          doctor: { doctor_id: body.doctor_id },
          appointment_date: new Date(body.date),
          time_slot: `${body.start_time}-${body.end_time}`,
        },
      });
      const WAVE_LIMIT = 3;
      if (count >= WAVE_LIMIT) throw new ConflictException('Slot fully booked (wave)');
      await this.appointmentRepo.save({
        doctor: doctor,
        patient:patient,
        appointment_date: body.date,
        time_slot: `${body.start_time}-${body.end_time}`,
        appointment_status: 'booked',
        reason: '',
        notes: '',
      });
      if (count + 1 >= WAVE_LIMIT) {
        slot.is_available = false;
        await this.slotRepo.save(slot);
      }
      return { message: 'Appointment booked (wave)', currentCount: count + 1 };
    }
    throw new BadRequestException('Invalid schedule type');
  }
}