import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateStudentDto } from './dto/create-student.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StudentEntity } from './entities/student.entity'
import { UpdateStudentDto } from './dto/update-student.dto'

@Injectable()
export class StudentsService {
	constructor(
		@InjectRepository(StudentEntity)
		private readonly studentRepository: Repository<StudentEntity>
	) {}

	async create(createStudentDto: CreateStudentDto) {
		const student = this.studentRepository.create(createStudentDto)
		return this.studentRepository.save(student)
	}

	async findAll() {
		return this.studentRepository.find()
	}

	async findOne(id: string) {
		const student = await this.studentRepository.findOne({ where: { id } })
		if (!student) {
			throw new NotFoundException(`Teacher with ID ${id} not found`)
		}
		return student
	}

	async update(id: string, updateStudentDto: UpdateStudentDto) {
		const student = await this.studentRepository.findOne({ where: { id } })
		if (!student) {
			throw new NotFoundException(`Student with ID ${id} not found`)
		}
		Object.assign(student, updateStudentDto)
		return this.studentRepository.save(student)
	}

	async delete(id: string) {
		const student = await this.studentRepository.delete(id)
		if (student.affected === 0) {
			throw new NotFoundException(`Teacher with ID ${id} not found`)
		}
	}
}
