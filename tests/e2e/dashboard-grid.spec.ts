import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard, createProject } from './helpers/test-utils';

let ctx: AppContext;

test.beforeEach(async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test('AG Grid 정렬 — Name 컬럼', async () => {
  await createProject(ctx.page, { name: 'C-프로젝트' });
  await createProject(ctx.page, { name: 'A-프로젝트' });
  await createProject(ctx.page, { name: 'B-프로젝트' });

  // Name 헤더 클릭 → 오름차순
  await ctx.page.click('.ag-header-cell[col-id="name"]');
  const rows = ctx.page.locator('.ag-row');
  await expect(rows).toHaveCount(3);

  // 첫 번째 행이 A-프로젝트
  const firstCell = ctx.page.locator('.ag-row[row-index="0"] .ag-cell[col-id="name"]');
  await expect(firstCell).toContainText('A-프로젝트');
});

test('검색 필터', async () => {
  await createProject(ctx.page, { name: 'alpha' });
  await createProject(ctx.page, { name: 'beta' });
  await createProject(ctx.page, { name: 'gamma' });

  await ctx.page.fill(SEL.DASHBOARD_SEARCH_FILTER, 'alpha');
  // debounce 대기
  await ctx.page.waitForTimeout(500);

  const visibleRows = ctx.page.locator('.ag-row:not(.ag-hidden)');
  await expect(visibleRows).toHaveCount(1);
  await expect(visibleRows.first()).toContainText('alpha');

  // 검색 지우기
  await ctx.page.fill(SEL.DASHBOARD_SEARCH_FILTER, '');
  await ctx.page.waitForTimeout(500);
  await expect(ctx.page.locator('.ag-row')).toHaveCount(3);
});

test('프로젝트 클릭 → Details Pane', async () => {
  await createProject(ctx.page, { name: 'DetailTest' });

  await ctx.page.locator('.ag-row').first().click();
  await expect(ctx.page.locator(SEL.DETAILS_PANE)).toBeVisible();
  await expect(ctx.page.locator(SEL.DETAILS_PANE_TITLE)).toHaveText('DetailTest');
});

test('프로젝트 더블클릭 → Project Home', async () => {
  await createProject(ctx.page, { name: 'HomeTest' });

  await ctx.page.locator('.ag-row').first().dblclick();
  await expect(ctx.page.locator(SEL.PROJECT_HOME)).toBeVisible({ timeout: 5000 });
});
