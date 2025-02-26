import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional() // This field is optional
  description?: string;

  @IsString()
  @IsOptional() // This field is optional, default value can be handled in the service
  status?: string; // You can set a default value in the service if not provided

  @IsNotEmpty() // Assuming user ID is required for task assignment
  userId: number; // Reference to the user assigned to the task
} 