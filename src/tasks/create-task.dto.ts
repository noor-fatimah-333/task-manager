import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { User } from 'src/users/user.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional() // This field is optional
  description?: string;

  @IsOptional() // This field is optional, default value can be handled in the service
  status?: string; // You can set a default value in the service if not provided

  @IsString()
  @IsOptional()
  assigneeEmail?: string;
}
