import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('students')
export class StudentEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	name: string

	@Column()
	group: string

	@Column({ nullable: true })
	birthDate?: string

	@Column({ nullable: true })
	phone?: string

	@Column({ nullable: true })
	email?: string
}
