import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorService } from 'src/doctor/doctor.service';
import { Patient } from 'src/entities/Patient';
import { Repository } from 'typeorm';
@Injectable()
export class PatientService {
    constructor(
  @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    ) {}
        async getDoctorAvailability(doctorId: number, page = 1, limit = 10) {
const slotRepo = this.patientRepo.manager.getRepository('DoctorTimeSlot'); // Assuming DoctorTimeSlot is the entity for slots
      if (page < 1) page = 1;   
        if (limit < 1 || limit > 100) limit = 10; // Limit to 100 for performance
        // Fetch available slots for the doctor with pagination
        const [slots, total] = await slotRepo.findAndCount({
          where: { doctor_id: doctorId, is_available: true },
          skip: (page - 1) * limit,
          take: limit,
        order: { date: 'ASC', start_time: 'ASC' },
      });
      return {
        total,
        page,
        limit,
        slots,
      };
    }
}
