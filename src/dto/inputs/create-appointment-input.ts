import { Field, InputType } from "type-graphql";

@InputType()
export class CreateAppointmentInput {
  @Field()
  customerId: string;

  @Field()
  startAt: Date;

  @Field()
  endsAt: Date;
}