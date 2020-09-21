import watchFile from './watch-file';
const file_path = process.env.file_path;

watchFile(file_path, function (data) {
  console.log(JSON.stringify(data));
});
