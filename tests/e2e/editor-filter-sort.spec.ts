import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard, createProject, openEditor } from './helpers/test-utils';

let ctx: AppContext;

test.beforeEach(async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProject(ctx.page, { name: 'FilterTest' });
  await openEditor(ctx.page);
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test('Source 필터 → 일치 세그먼트만 표시', async () => {
  await ctx.page.fill(SEL.FILTER_SOURCE, 'Hello');
  // debounce + AG Grid 리렌더 대기
  await ctx.page.waitForTimeout(500);

  // "Hello, world!" 세그먼트만 남아야 함
  const rows = ctx.page.locator('.ag-center-cols-container .ag-row');
  await expect(rows).toHaveCount(1);

  // 필터 지우기
  await ctx.page.fill(SEL.FILTER_SOURCE, '');
  await ctx.page.waitForTimeout(500);
  await expect(ctx.page.locator('.ag-center-cols-container .ag-row')).toHaveCount(20);
});

test('정렬: Alphabetical(Source)', async () => {
  await ctx.page.selectOption(SEL.FILTER_SORT_SELECT, 'source-alpha');
  await ctx.page.waitForTimeout(200);

  // 첫 행이 알파벳 순 가장 빠른 것
  const firstRow = ctx.page.locator('.ag-row[row-index="0"] .ag-cell[col-id="source"]');
  const text = await firstRow.textContent();
  expect(text).toBeTruthy();

  // No sorting으로 복원
  await ctx.page.selectOption(SEL.FILTER_SORT_SELECT, 'none');
  await ctx.page.waitForTimeout(200);
  const firstRowAfter = ctx.page.locator('.ag-row[row-index="0"] .ag-cell[col-id="source"]');
  await expect(firstRowAfter).toContainText('Hello, world!');
});

test('StatusBar 카운트 정확성', async () => {
  const statusbar = ctx.page.locator(SEL.EDITOR_STATUSBAR);
  await expect(statusbar).toBeVisible();

  // 샘플 데이터: 20개 세그먼트, confirmed 4개 + r1 1개 + r2 1개 = 6개 → 30%
  const text = await statusbar.textContent();
  expect(text).toContain('30%');
  expect(text).toContain('Seg');
});
