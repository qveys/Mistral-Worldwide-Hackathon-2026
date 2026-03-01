import path from 'node:path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const cwd = process.cwd();
const turbopackRoot =
  cwd.endsWith('app/frontend') || (path.basename(cwd) === 'frontend' && path.basename(path.dirname(cwd)) === 'app')
    ? path.resolve(cwd, '..', '..')
    : cwd;

const nextConfig = {
  turbopack: { root: turbopackRoot },
};

export default withNextIntl(nextConfig);
