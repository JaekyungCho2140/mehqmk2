import { _electron, type ElectronApplication, type Page } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

export interface AppContext {
  readonly electronApp: ElectronApplication;
  readonly page: Page;
  readonly userDataDir: string;
}

export async function launchApp(): Promise<AppContext> {
  // 테스트 격리: 임시 userData 디렉토리
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mehq-test-'));

  const electronApp = await _electron.launch({
    args: ['.', `--user-data-dir=${userDataDir}`],
    cwd: path.resolve(__dirname, '../../..'),
    env: {
      ...process.env,
      NODE_ENV: 'production', // DevTools 비활성화
    },
  });

  // 메인 윈도우(DevTools가 아닌) 가져오기
  const page = await electronApp.firstWindow();
  await page.waitForLoadState('domcontentloaded');

  return { electronApp, page, userDataDir };
}

export async function closeApp(ctx: AppContext): Promise<void> {
  await ctx.electronApp.close();

  // 임시 디렉토리 정리
  try {
    fs.rmSync(ctx.userDataDir, { recursive: true, force: true });
  } catch {
    // 정리 실패해도 테스트에 영향 없음
  }
}
