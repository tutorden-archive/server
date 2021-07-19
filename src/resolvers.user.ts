import 'reflect-metadata'
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  InputType,
  Field,
} from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { User } from './user'
import { PrismaService } from './prisma.service'

@InputType()
class UserCreateInput {
  @Field()
  email: string

  @Field({ nullable: true })
  name: string
}

@Resolver(User)
export class UserResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) { }

  @Mutation((returns) => User)
  async signupUser(
    @Args('data') data: UserCreateInput,
    @Context() ctx,
  ): Promise<User> {

    return this.prismaService.user.create({
      data: {
        email: data.email,
        name: data.name,
      },
    })
  }

  @Query((returns) => [User], { nullable: true })
  async allUsers(@Context() ctx): Promise<User[]> {
    return this.prismaService.user.findMany()
  }
}
