import { Request } from 'express'

export interface IUser {
	id: number
	email: string
	surname: string
	name: string
	patronymic: string
	ava: string | number
}

export interface UserRequest extends Request {
	user: {
		id: number
		email: string
		password: string
		surname: string
		name: string
		isAdmin: boolean
		isOnline: boolean
	}
}
