import { Module } from '@nestjs/common'
import { StudentsService } from './students.service'
import { StudentsController } from './students.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StudentEntity } from './entities/student.entity'
import { TeacherEntity } from '../teachers/entities/teacher.entity'
import { ScheduleEntity } from '../groups/entities/schedule.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([StudentEntity, TeacherEntity, ScheduleEntity])
	],
	controllers: [StudentsController],
	providers: [StudentsService]
})
export class StudentsModule {}
