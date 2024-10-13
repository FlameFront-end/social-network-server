const fs = require('fs-extra')

async function copyUploads() {
	try {
		await fs.copy('uploads', 'uploads_backup')
		console.log('Папка uploads скопирована в uploads_backup')
	} catch (err) {
		console.error('Ошибка при копировании папки:', err)
	}
}

void copyUploads()
