import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { CreateAppointmentInput } from '../dto/inputs/create-appointment-input';
import { Appointment } from '../dto/models/appointment-model';
import { Customer } from '../dto/models/customer-model';

@Resolver(() => Appointment)
export class AppointmentsResolver {
  @Query(() => [Appointment])
  async appointments() {
    return [
      {
        startsAt: new Date(),
        endsAt: new Date(),
      }
    ]
  }

  @Mutation(() => Appointment)
  async createAppointment(@Arg('data') data: CreateAppointmentInput) {
    const appointment = {
      startsAt: data.startAt,
      endsAt: data.endsAt,
    }

    return appointment;
  }

  @FieldResolver(() => Customer)
  async customer(@Root() appointment: Appointment) {
    console.log(appointment);

    return {
      name: 'Customer de teste'
    }
  }
}