import fs from 'node:fs';
import path from 'node:path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const findRepoRoot = (startDir) => {
  let dir = path.resolve(startDir);
  while (true) {
    if (fs.existsSync(path.join(dir, '.git'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      return path.resolve(startDir);
    }
    dir = parent;
  }
};

const turbopackRoot = findRepoRoot(process.cwd());

const nextConfig = {
  turbopack: { root: turbopackRoot },
};

export default withNextIntl(nextConfig);
