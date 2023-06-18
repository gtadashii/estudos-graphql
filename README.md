# GraphQL

Compilado com o resumo de meus estudos referentes ao GraphQL

## O que é GraphQL?

Não é um framework, basicamente é uma camada, que pode ser implementada em diversas linguagens de programação, entre aplicações back-end e front-end se comuniquem de uma forma mais efetiva.

O principais problemas que o GraphQL se propoem a resolver são:

- Under fetching
  Quando um endpoint traz poucas informações, sendo necessário consultar end-points a mais para conseguir o dado completo
- Over fetching
  Quando precisamos de somente uma pequena parte dos dados, mas o end-point traz dados a mais, trafegando dados desnecessários.

## O que é [parte técnica]

O GraphQL pode ser resumido basicamente em duas ações:

- Query: operações de leitura
- Mutation: operações de alteração de dados, podendo ser criação, atualização ou deleção.

Outro conceito são os inputs, que basicamente são objetos que definem os atributos de entrada de um query ou mutation

Para definir as operações de mutation ou query utilizamos o que chamamos de schema para definir a tipagem, exemplos:

```graphql
# Com GraphQL utilizamos a `!` para indicar dados obrigatórios.
type User {
  id: String!
  name: String!
}

type Query {
  users: [User!]! # nesse caso, o retorno sempre será um array, e sempre conterá User
}

type Mutation {
  createUser(name: String!): User!
}
```

A implementação das queries e mutations é feita pelos resolvers, funcionam semelhante a um controller, onde faram todos os processos necessários para executar a ação desejada.

```tsx
// implementação de exemplo
const server = new ApolloServer({
  typeDefs, // aqui seria o nosso schema, como demonstrado no trecho acima
  resolvers: {
    Query: {
      users: () => {
        return users;
      },
    },
    Mutation: {
      createUser: (parent, args, context) => {
        const user = {
          name: args.name,
          age: args.age,
        };
      },
    },
  },
});
```

## Abordagens

- Schema first: abordagem onde antes de iniciarmos qualquer nova alteração, criamos / ajustamos o schema
- Code first: schema é criado de forma automática baseada em nosso código (começando pelos resolvers)

Exemplo de code first utilizando para gerar nossos schemas a lib `type-graphql`

```tsx
import { Query, Resolver, Field, ObjectType, InputType } from "type-graphql";

@Resolver()
export class AppointmentsResolver {
  @Query(() => String)
  async helloWorld() {
    return "Hello World";
  }
}

@ObjectType()
export class Appointment {
  @Field()
  startsAt: Date;

  @Field()
  endsAt: Date;
}

@InputType()
export class CreateAppointmentInput {
  @Field()
  customerId: string;

  @Field()
  startAt: Date;

  @Field()
  endsAt: Date;
}
```

```tsx
import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { CreateAppointmentInput } from "../dto/inputs/create-appointment-input";
import { Appointment } from "../dto/models/appointment-model";
import { Customer } from "../dto/models/customer-model";

@Resolver(() => Appointment)
export class AppointmentsResolver {
  @Query(() => [Appointment])
  async appointments() {
    return [
      {
        startsAt: new Date(),
        endsAt: new Date(),
      },
    ];
  }

  @Mutation(() => Appointment)
  async createAppointment(@Arg("data") data: CreateAppointmentInput) {
    const appointment = {
      startsAt: data.startAt,
      endsAt: data.endsAt,
    };

    return appointment;
  }

  @FieldResolver(() => Customer)
  async customer(@Root() appointment: Appointment) {
    console.log(appointment);

    return {
      name: "Customer de teste",
    };
  }
}
```
