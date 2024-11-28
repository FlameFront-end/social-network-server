import { Module } from '@nestjs/common'
import { StudentsService } from './students.service'
import { StudentsController } from './students.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StudentEntity } from './entities/student.entity'

@Module({
	imports: [TypeOrmModule.forFeature([StudentEntity])],
	controllers: [StudentsController],
	providers: [StudentsService]
})
export class StudentsModule {}
