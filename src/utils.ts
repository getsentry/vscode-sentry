import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as promisify from 'util.promisify';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

export async function withTempFile<T>(
  contents: string,
  func: (filePath: string) => Thenable<T> | T,
): Promise<T> {
  const random = Math.random()
    .toString()
    .substr(2);

  const filePath = path.join(os.tmpdir(), `${random}.json`);
  await writeFile(filePath, contents);

  try {
    return await func(filePath);
  } finally {
    await unlink(filePath);
  }
}
