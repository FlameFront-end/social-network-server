import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn
} from 'typeorm'
import { GroupEntity } from './group.entity'
import { TeacherEntity } from '../../teachers/entities/teacher.entity'

export interface Lesson {
	cabinet: string
	teacher: TeacherEntity
	title: string
}

@Entity('schedules')
export class ScheduleEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column('jsonb')
	monday: Lesson[]

	@Column('jsonb')
	tuesday: Lesson[]

	@Column('jsonb')
	wednesday: Lesson[]

	@Column('jsonb')
	thursday: Lesson[]

	@Column('jsonb')
	friday: Lesson[]

	@OneToOne(() => GroupEntity, group => group.schedule)
	@JoinColumn()
	group: GroupEntity
}
