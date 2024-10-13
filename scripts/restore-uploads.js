const fs = require('fs-extra')

async function restoreUploads() {
	try {
		await fs.remove('uploads') // Удаляем старую папку uploads
		await fs.move('uploads_backup', 'uploads') // Восстанавливаем папку
		console.log('Папка uploads восстановлена из uploads_backup')
	} catch (err) {
		console.error('Ошибка при восстановлении папки:', err)
	}
}

void restoreUploads()
