import type { ForgeConfig } from '@electron-forge/shared-types';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { execSync } from 'node:child_process';

const config: ForgeConfig = {
  packagerConfig: {
    name: 'mehQ',
    asar: {
      // 네이티브 모듈은 asar에서 unpack (런타임 로드 필요)
      unpack: '**/{better-sqlite3,bindings,prebuild-install}/**',
    },
  },
  hooks: {
    packageAfterPrune: async (_config, buildPath) => {
      // Vite가 better-sqlite3를 external로 처리하므로, 패키징 시 수동 설치 필요
      execSync('npm install --omit=dev --ignore-scripts', {
        cwd: buildPath,
        stdio: 'inherit',
      });

      // Electron용 네이티브 모듈 리빌드
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const electronVersion = require('electron/package.json').version;
      execSync(
        `npx @electron/rebuild -f -m . -v ${electronVersion}`,
        { cwd: buildPath, stdio: 'inherit' }
      );
    },
  },
  makers: [
    new MakerZIP({}, ['darwin', 'linux', 'win32']),
    new MakerDMG({}, ['darwin']),
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'src/main/index.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload/index.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
  ],
};

export default config;
