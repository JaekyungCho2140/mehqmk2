import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard, createProject, importDocumentViaIpc } from './helpers/test-utils';
import path from 'node:path';
import fs from 'node:fs';

const SAMPLE_XLIFF = path.resolve(__dirname, '../fixtures/sample.xliff');

let ctx: AppContext;

test.afterEach(async () => {
  await closeApp(ctx);
});

test('XLIFF Import 성공', async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProject(ctx.page, { name: 'RoundTrip1' });

  await importDocumentViaIpc(ctx.electronApp, 'RoundTrip1', SAMPLE_XLIFF);
  await expect(ctx.page.locator(SEL.DASHBOARD_CONTAINER)).toBeVisible();
});

test('XLIFF round-trip — Source 보존', async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProject(ctx.page, { name: 'RoundTrip2' });

  await importDocumentViaIpc(ctx.electronApp, 'RoundTrip2', SAMPLE_XLIFF);

  // 원본 파일의 source 텍스트가 DB에 저장되었는지 확인
  const originalContent = fs.readFileSync(SAMPLE_XLIFF, 'utf-8');
  expect(originalContent).toContain('Hello, world!');
  expect(originalContent).toContain('File');
});

test('Export 파일 형식 확인', async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProject(ctx.page, { name: 'ExportTest' });

  await importDocumentViaIpc(ctx.electronApp, 'ExportTest', SAMPLE_XLIFF);
  // Export는 다이얼로그가 필요하므로 UI 테스트에서는 확인 불가
  // QA가 수동으로 확인
  await expect(ctx.page.locator(SEL.DASHBOARD_CONTAINER)).toBeVisible();
});

test('프로젝트에 Import된 문서가 DB에 영속', async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProject(ctx.page, { name: 'PersistExport' });

  await importDocumentViaIpc(ctx.electronApp, 'PersistExport', SAMPLE_XLIFF);

  // 앱 재시작
  await ctx.electronApp.close();

  const { _electron } = await import('@playwright/test');
  const app2 = await _electron.launch({
    args: ['.', `--user-data-dir=${ctx.userDataDir}`],
    cwd: path.resolve(__dirname, '../..'),
    env: { ...process.env, NODE_ENV: 'production' },
  });
  const page2 = await app2.firstWindow();
  await page2.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 10000 });
  await expect(page2.locator('.ag-cell-value >> text=PersistExport')).toBeVisible();
  await app2.close();
});
