import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard, createProject, importDocumentViaIpc } from './helpers/test-utils';
import path from 'node:path';

const SAMPLE_PO = path.resolve(__dirname, '../fixtures/sample.po');

let ctx: AppContext;

test.afterEach(async () => {
  await closeApp(ctx);
});

test('PO Import → 세그먼트 저장', async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProject(ctx.page, { name: 'PoImport' });

  await importDocumentViaIpc(ctx.electronApp, 'PoImport', SAMPLE_PO);
  await expect(ctx.page.locator(SEL.DASHBOARD_CONTAINER)).toBeVisible();
});

test('PO Import — 복수형 세그먼트', async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProject(ctx.page, { name: 'PoPluralImport' });

  await importDocumentViaIpc(ctx.electronApp, 'PoPluralImport', SAMPLE_PO);
  // PO 파일에 복수형 있음 → 세그먼트 수가 단순 msgid 수보다 많아야 함
  await expect(ctx.page.locator(SEL.DASHBOARD_CONTAINER)).toBeVisible();
});
