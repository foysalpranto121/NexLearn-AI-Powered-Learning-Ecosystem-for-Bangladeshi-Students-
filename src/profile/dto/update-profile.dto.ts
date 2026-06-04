import { IsString, IsOptional, IsInt, Min, Max, IsIn } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  targetCareer?: string;

  @IsString()
  @IsOptional()
  @IsIn(['beginner', 'intermediate', 'advanced'], {
    message: 'currentLevel must be beginner, intermediate, or advanced',
  })
  currentLevel?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(80)
  weeklyHours?: number;

  @IsString()
  @IsOptional()
  preferredLanguage?: string;

  @IsString()
  @IsOptional()
  @IsIn(['visual', 'text', 'practice', 'mixed'], {
    message: 'learningStyle must be visual, text, practice, or mixed',
  })
  learningStyle?: string;

  @IsString()
  @IsOptional()
  timezone?: string;
}
