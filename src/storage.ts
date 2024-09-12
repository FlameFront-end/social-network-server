import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import * as path from 'path'
import * as fs from 'fs'

const generateId = () =>
	Array(18)
		.fill(null)
		.map(() => Math.round(Math.random() * 16).toString(16))
		.join('')

const normalizeFileName = (req, file, callback) => {
	const fileExtName = file.originalname.split('.').pop()

	callback(null, `${generateId()}.${fileExtName}`)
}

export const avaStorage = diskStorage({
	destination: './uploads/ava',
	filename: normalizeFileName
})

export const voiceStorage = diskStorage({
	destination: (req, file, callback) => {
		const dir = './uploads/voice'
		fs.mkdirSync(dir, { recursive: true })
		callback(null, dir)
	},
	filename: (req, file, callback) => {
		const fileExtName = path.extname(file.originalname)
		const fileName = `${uuidv4()}${fileExtName}`
		callback(null, fileName)
	}
})
