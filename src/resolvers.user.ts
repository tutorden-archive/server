import 'reflect-metadata'
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  InputType,
  Field,
  GqlExecutionContext,
} from '@nestjs/graphql'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from './user'
import { PrismaService } from './prisma.service'
import { AuthService } from './auth/auth.service'

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);

@InputType()
class UserCreateInput {
  @Field()
  email: string

  @Field({ nullable: true })
  name: string
}

@Resolver(User)
export class UserResolver {
  constructor( private prismaService: PrismaService, private authService: AuthService ) { }

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

  @Query((returns) => String)
  async login(@Context() ctx, @Args('email') email: string, @Args('password') password: string ): Promise<string> {
    return (await this.authService.login( { username: email, password })).access_token
  }
}
