import { test, expect } from '@playwright/test';
import { _electron } from '@playwright/test';
import { SEL } from './helpers/selectors';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

test('Wizard 완료 후 재시작 시 Dashboard 바로 표시', async () => {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mehq-test-'));

  try {
    // 첫 번째 실행: Wizard 완료
    const app1 = await _electron.launch({
      args: ['.', `--user-data-dir=${userDataDir}`],
      cwd: path.resolve(__dirname, '../..'),
      env: { ...process.env, NODE_ENV: 'production' },
    });
    const page1 = await app1.firstWindow();
    await page1.waitForSelector(SEL.WIZARD_CONTAINER, { timeout: 10000 });

    await page1.fill(SEL.STEP_USERNAME_INPUT, 'PersistUser');
    await page1.click(SEL.WIZARD_NEXT_BTN);
    await page1.click(SEL.WIZARD_FINISH_BTN);
    await page1.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });
    await app1.close();

    // 두 번째 실행: Dashboard 바로 표시
    const app2 = await _electron.launch({
      args: ['.', `--user-data-dir=${userDataDir}`],
      cwd: path.resolve(__dirname, '../..'),
      env: { ...process.env, NODE_ENV: 'production' },
    });
    const page2 = await app2.firstWindow();
    await page2.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 10000 });

    const wizard = page2.locator(SEL.WIZARD_CONTAINER);
    await expect(wizard).not.toBeVisible();

    const dashboard = page2.locator(SEL.DASHBOARD_CONTAINER);
    await expect(dashboard).toBeVisible();
    await app2.close();
  } finally {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
});

test('Wizard 중단 후 재시작 시 Wizard 처음부터', async () => {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mehq-test-'));

  try {
    // 첫 번째 실행: Step 2까지만 진행 후 종료
    const app1 = await _electron.launch({
      args: ['.', `--user-data-dir=${userDataDir}`],
      cwd: path.resolve(__dirname, '../..'),
      env: { ...process.env, NODE_ENV: 'production' },
    });
    const page1 = await app1.firstWindow();
    await page1.waitForSelector(SEL.WIZARD_CONTAINER, { timeout: 10000 });

    await page1.fill(SEL.STEP_USERNAME_INPUT, 'InterruptUser');
    await page1.click(SEL.WIZARD_NEXT_BTN);
    await page1.waitForSelector(SEL.STEP_WORKDIR_PATH, { timeout: 5000 });
    // Finish 누르지 않고 종료
    await app1.close();

    // 두 번째 실행: Wizard 다시 표시 (Step 1부터)
    const app2 = await _electron.launch({
      args: ['.', `--user-data-dir=${userDataDir}`],
      cwd: path.resolve(__dirname, '../..'),
      env: { ...process.env, NODE_ENV: 'production' },
    });
    const page2 = await app2.firstWindow();
    await page2.waitForSelector(SEL.WIZARD_CONTAINER, { timeout: 10000 });

    // Step 1에 있음 (이름 입력 필드)
    const input = page2.locator(SEL.STEP_USERNAME_INPUT);
    await expect(input).toBeVisible();
    await app2.close();
  } finally {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
});
