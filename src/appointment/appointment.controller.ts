import { Controller, Post, Body, UseGuards, Req, ConflictException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppointmentService } from './appointment.service';

@Controller('api/v1/appointments')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async bookAppointment(@Body() body, @Req() req) {
    if (req.user.role !== 'patient') throw new ConflictException('Only patients can book appointments');
    console.log(req.user)
    return this.appointmentService.bookAppointment(body, req.user.email);
  }
}