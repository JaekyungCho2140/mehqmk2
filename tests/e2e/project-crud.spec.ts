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

test('프로젝트 생성 — 전체 필드', async () => {
  await createProject(ctx.page, {
    name: '테스트 프로젝트',
    sourceLang: 'ko',
    targetLang: 'en',
    client: 'Acme',
  });

  // 그리드에 프로젝트 표시 확인
  const grid = ctx.page.locator(SEL.PROJECT_GRID);
  await expect(grid).toBeVisible();
  await expect(ctx.page.locator('.ag-row').first()).toBeVisible();
  await expect(ctx.page.locator('.ag-cell-value >> text=테스트 프로젝트')).toBeVisible();
});

test('프로젝트 생성 — 최소 필드', async () => {
  await createProject(ctx.page, { name: '최소 프로젝트' });
  await expect(ctx.page.locator('.ag-cell-value >> text=최소 프로젝트')).toBeVisible();
});

test('프로젝트 생성 — 중복 이름 에러', async () => {
  await createProject(ctx.page, { name: '중복테스트' });

  // 같은 이름으로 다시 생성 시도
  await ctx.page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
  await ctx.page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });
  await ctx.page.fill(SEL.NEW_PROJECT_NAME_INPUT, '중복테스트');

  await ctx.page.click(SEL.NEW_PROJECT_SOURCE_LANG);
  await ctx.page.click(`${SEL.NEW_PROJECT_SOURCE_LANG_DROPDOWN} .lang-select-option >> text=ko`);
  await ctx.page.click(SEL.NEW_PROJECT_TARGET_LANG);
  await ctx.page.click(`${SEL.NEW_PROJECT_TARGET_LANG_DROPDOWN} .lang-select-option >> text=en`);

  // Next → Documents → Finish
  await ctx.page.click('[data-testid="new-project-next-btn"]');
  await ctx.page.waitForSelector('[data-testid="file-drop-zone"]', { timeout: 5000 });
  await ctx.page.click(SEL.NEW_PROJECT_FINISH_BTN);

  // 에러 메시지 표시, Wizard의 Details 단계로 돌아감
  await expect(ctx.page.locator('.text-input-error')).toBeVisible();
  await expect(ctx.page.locator(SEL.NEW_PROJECT_WIZARD)).toBeVisible();
});

test('프로젝트 생성 — Cancel', async () => {
  await ctx.page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
  await ctx.page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });
  await ctx.page.fill(SEL.NEW_PROJECT_NAME_INPUT, '취소할 프로젝트');
  await ctx.page.click(SEL.NEW_PROJECT_CANCEL_BTN);

  // Dashboard 복귀
  await expect(ctx.page.locator(SEL.DASHBOARD_CONTAINER)).toBeVisible();
  // 프로젝트가 없어야 함
  await expect(ctx.page.locator(SEL.DASHBOARD_EMPTY_MESSAGE)).toBeVisible();
});

test('프로젝트 Clone', async () => {
  await createProject(ctx.page, { name: '원본프로젝트' });

  // 우클릭 → Clone
  await ctx.page.locator('.ag-row').first().click({ button: 'right' });
  await ctx.page.click(`${SEL.CONTEXT_MENU} >> text=Clone`);

  // Clone 다이얼로그
  await expect(ctx.page.locator(SEL.CLONE_DIALOG)).toBeVisible();
  const nameInput = ctx.page.locator(SEL.CLONE_DIALOG_NAME_INPUT);
  await expect(nameInput).toHaveValue('원본프로젝트 - clone');

  await ctx.page.click(SEL.CLONE_DIALOG_CONFIRM);

  // 목록에 2개 프로젝트
  await expect(ctx.page.locator('.ag-row')).toHaveCount(2);
});

test('프로젝트 Delete', async () => {
  await createProject(ctx.page, { name: '삭제프로젝트' });

  // 우클릭 → Delete
  await ctx.page.locator('.ag-row').first().click({ button: 'right' });
  await ctx.page.click(`${SEL.CONTEXT_MENU} >> text=Delete`);

  // 확인 다이얼로그
  await expect(ctx.page.locator(SEL.CONFIRM_DIALOG)).toBeVisible();
  await ctx.page.click(SEL.CONFIRM_DIALOG_CONFIRM);

  // 빈 상태
  await expect(ctx.page.locator(SEL.DASHBOARD_EMPTY_MESSAGE)).toBeVisible();
});

test('프로젝트 Delete — Cancel', async () => {
  await createProject(ctx.page, { name: '유지프로젝트' });

  await ctx.page.locator('.ag-row').first().click({ button: 'right' });
  await ctx.page.click(`${SEL.CONTEXT_MENU} >> text=Delete`);
  await ctx.page.click(SEL.CONFIRM_DIALOG_CANCEL);

  // 프로젝트 여전히 존재
  await expect(ctx.page.locator('.ag-cell-value >> text=유지프로젝트')).toBeVisible();
});

test('프로젝트 영속성', async () => {
  await createProject(ctx.page, { name: '영속프로젝트' });
  await ctx.electronApp.close();

  // 재시작 (같은 userData)
  const { _electron } = await import('@playwright/test');
  const app2 = await _electron.launch({
    args: ['.', `--user-data-dir=${ctx.userDataDir}`],
    cwd: (await import('node:path')).resolve(__dirname, '../..'),
    env: { ...process.env, NODE_ENV: 'production' },
  });
  const page2 = await app2.firstWindow();
  await page2.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 10000 });
  await expect(page2.locator('.ag-cell-value >> text=영속프로젝트')).toBeVisible();
  await app2.close();
});
