const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const openAsync = promisify(fs.open);
const readAsync = promisify(fs.read);
const statAsync = promisify(fs.stat);
const log = console.log.bind(console);
const fileSizes = {};
const fds = {};
chokidar
  .watch(path.resolve(__dirname, './log.txt'))
  .on('add', async function (filePath) {
    fileSizes[filePath] = (await statAsync(filePath)).size;
  })
  .on('addDir', function (path) {
    log('Directory', path, 'has been added');
  })
  .on('change', async function (filePath) {
    console.log('filePath');
    try {
      const newSize = (await statAsync(filePath)).size;
      await sendNewMessages(filePath, newSize, fileSizes[filePath]);
      fileSizes[filePath] = newSize;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  })
  .on('unlink', function (path) {
    delete fileSizes[filePath];
    delete fds[filePath];
  });

async function sendNewMessages(filePath, newSize, oldSize) {
  let fd = fds[filePath];
  if (!fd) {
    fd = await openAsync(filePath, 'r');
    fds[filePath] = fd;
  }
  const offset = Math.max(newSize - oldSize, 0);
  const readBuffer = Buffer.alloc(offset);
  await readAsync(fd, readBuffer, 0, offset, oldSize);
  console.log(readBuffer.toString());
  const messages = readBuffer
    .toString()
    .split('\r\n')
    .filter((msg) => !!msg.trim());
//   messages.forEach((message) => {
//     log(`+msg||${message}\0`);
//   });
}
