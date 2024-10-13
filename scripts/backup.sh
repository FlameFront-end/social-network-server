if [ -d "./uploads" ]; then
  echo "Копирование файлов из uploads в папку backup..."
  mkdir -p ./backup
  cp -r ./uploads/* ./backup/
fi
