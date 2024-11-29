import { IsArray, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class LessonDto {
	@IsString()
	cabinet: string

	@IsString()
	teacher: string

	@IsString()
	title: string
}

export class ScheduleDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => LessonDto)
	monday: LessonDto[]

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => LessonDto)
	tuesday: LessonDto[]

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => LessonDto)
	wednesday: LessonDto[]

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => LessonDto)
	thursday: LessonDto[]

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => LessonDto)
	friday: LessonDto[]
}

export class CreateGroupDto {
	@IsString()
	name: string

	@IsString()
	teacher: string

	@IsArray()
	@IsString({ each: true })
	students: string[]

	@ValidateNested()
	@Type(() => ScheduleDto)
	schedule: ScheduleDto
}
