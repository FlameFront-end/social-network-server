if [ -d "./backup" ]; then
  echo "Восстановление файлов из backup в папку uploads..."
  mkdir -p ./uploads
  cp -r ./backup/* ./uploads/
fi
