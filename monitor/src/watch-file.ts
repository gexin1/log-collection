import { spawn } from 'child_process';

export default function (watchFile = '', success = (data: Object) => {}) {
  if (!watchFile) {
    console.error(`请传入 process.env.watch_file`);
    process.exit();
  }

  const ls = spawn('tail', ['-f', watchFile]);

  ls.stdout.on('data', (data) => {
    try {
      const body: Object = JSON.parse(data);
      success(body);
    } catch (error) {
      console.warn('ls.stdout data parse', error.message);
    }
  });

  ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`子进程退出，退出码 ${code}`);
  });
}
