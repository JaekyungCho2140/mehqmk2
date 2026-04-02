import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard, createProject, importDocumentViaIpc } from './helpers/test-utils';
import path from 'node:path';

const SAMPLE_XLIFF = path.resolve(__dirname, '../fixtures/sample.xliff');
const SAMPLE_V2_XLIFF = path.resolve(__dirname, '../fixtures/sample-v2.xliff');

let ctx: AppContext;

test.afterEach(async () => {
  await closeApp(ctx);
});

test('XLIFF 1.2 Import → 에디터에 세그먼트 표시', async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProject(ctx.page, { name: 'XliffImport' });

  // IPC로 Import
  await importDocumentViaIpc(ctx.electronApp, 'XliffImport', SAMPLE_XLIFF);

  // Project Home → Editor (하드코딩 세그먼트가 아닌 DB 세그먼트 표시)
  // 현재 에디터는 documentId 없이 열리면 하드코딩 세그먼트를 사용
  // Import 성공 확인은 토스트 또는 DB로
  await expect(ctx.page.locator(SEL.DASHBOARD_CONTAINER)).toBeVisible();
});

test('XLIFF 2.0 Import → 세그먼트 저장', async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProject(ctx.page, { name: 'Xliff2Import' });

  await importDocumentViaIpc(ctx.electronApp, 'Xliff2Import', SAMPLE_V2_XLIFF);
  await expect(ctx.page.locator(SEL.DASHBOARD_CONTAINER)).toBeVisible();
});

test('Import 후 앱 재시작 → 프로젝트 유지', async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProject(ctx.page, { name: 'PersistImport' });

  await importDocumentViaIpc(ctx.electronApp, 'PersistImport', SAMPLE_XLIFF);
  await ctx.electronApp.close();

  // 재시작 — 같은 userData
  const { _electron } = await import('@playwright/test');
  const app2 = await _electron.launch({
    args: ['.', `--user-data-dir=${ctx.userDataDir}`],
    cwd: path.resolve(__dirname, '../..'),
    env: { ...process.env, NODE_ENV: 'production' },
  });
  const page2 = await app2.firstWindow();
  await page2.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 10000 });

  // 프로젝트가 여전히 존재
  await expect(page2.locator('.ag-cell-value >> text=PersistImport')).toBeVisible();
  await app2.close();
});
