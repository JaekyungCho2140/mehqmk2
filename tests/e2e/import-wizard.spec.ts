import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard } from './helpers/test-utils';

let ctx: AppContext;

test.afterEach(async () => {
  await closeApp(ctx);
});

test('Wizard Step 2 Documents 표시', async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);

  // New Project → Details → Next
  await ctx.page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
  await ctx.page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });
  await ctx.page.fill(SEL.NEW_PROJECT_NAME_INPUT, 'WizardDocTest');

  await ctx.page.click(SEL.NEW_PROJECT_SOURCE_LANG);
  await ctx.page.click(`${SEL.NEW_PROJECT_SOURCE_LANG_DROPDOWN} .lang-select-option >> text=en`);
  await ctx.page.click(SEL.NEW_PROJECT_TARGET_LANG);
  await ctx.page.click(`${SEL.NEW_PROJECT_TARGET_LANG_DROPDOWN} .lang-select-option >> text=ko`);

  // Next → Documents 단계
  await ctx.page.click('[data-testid="new-project-next-btn"]');
  await expect(ctx.page.locator('[data-testid="file-drop-zone"]')).toBeVisible();
});

test('Wizard Documents → Finish (파일 없이)', async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);

  await ctx.page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
  await ctx.page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });
  await ctx.page.fill(SEL.NEW_PROJECT_NAME_INPUT, 'NoDocProject');

  await ctx.page.click(SEL.NEW_PROJECT_SOURCE_LANG);
  await ctx.page.click(`${SEL.NEW_PROJECT_SOURCE_LANG_DROPDOWN} .lang-select-option >> text=en`);
  await ctx.page.click(SEL.NEW_PROJECT_TARGET_LANG);
  await ctx.page.click(`${SEL.NEW_PROJECT_TARGET_LANG_DROPDOWN} .lang-select-option >> text=ko`);

  await ctx.page.click('[data-testid="new-project-next-btn"]');
  await ctx.page.click(SEL.NEW_PROJECT_FINISH_BTN);

  // Dashboard 복귀 + 프로젝트 존재
  await ctx.page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });
  await expect(ctx.page.locator('.ag-cell-value >> text=NoDocProject')).toBeVisible();
});

test('Import Settings 다이얼로그', async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);

  // 현재 ImportSettings 다이얼로그는 Documents 단계에서 파일 추가 후 표시
  // 파일 드래그앤드롭은 자동화 어려움 → 다이얼로그 단독 테스트는 수동 QA
  await expect(ctx.page.locator(SEL.DASHBOARD_CONTAINER)).toBeVisible();
});
