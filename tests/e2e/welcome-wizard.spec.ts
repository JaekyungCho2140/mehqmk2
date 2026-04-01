import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';

let ctx: AppContext;

test.beforeEach(async () => {
  ctx = await launchApp();
  // Wizard가 로드될 때까지 대기
  await ctx.page.waitForSelector(SEL.WIZARD_CONTAINER, { timeout: 10000 });
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test('Step 1 — 이름 미입력 시 Next 비활성', async () => {
  const nextBtn = ctx.page.locator(SEL.WIZARD_NEXT_BTN);
  await expect(nextBtn).toBeDisabled();
});

test('Step 1 → Step 2 → Finish 전체 플로우', async () => {
  // Step 1: 이름 입력
  await ctx.page.fill(SEL.STEP_USERNAME_INPUT, 'TestUser');
  await ctx.page.click(SEL.WIZARD_NEXT_BTN);

  // Step 2 표시 확인
  const workdirPath = ctx.page.locator(SEL.STEP_WORKDIR_PATH);
  await expect(workdirPath).toBeVisible();

  // 기본 경로가 표시됨
  const pathValue = await workdirPath.inputValue();
  expect(pathValue.length).toBeGreaterThan(0);

  // Finish 클릭 → Dashboard 전환
  await ctx.page.click(SEL.WIZARD_FINISH_BTN);
  await ctx.page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });
  const dashboard = ctx.page.locator(SEL.DASHBOARD_CONTAINER);
  await expect(dashboard).toBeVisible();
});

test('Back 버튼으로 이전 단계 이동, 입력값 유지', async () => {
  // Step 1: 이름 입력
  await ctx.page.fill(SEL.STEP_USERNAME_INPUT, 'BackTest');
  await ctx.page.click(SEL.WIZARD_NEXT_BTN);

  // Step 2 확인
  await expect(ctx.page.locator(SEL.STEP_WORKDIR_PATH)).toBeVisible();

  // Back → Step 1
  await ctx.page.click(SEL.WIZARD_BACK_BTN);

  // 입력값 유지 확인
  const input = ctx.page.locator(SEL.STEP_USERNAME_INPUT);
  await expect(input).toHaveValue('BackTest');
});
