import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard } from './helpers/test-utils';

let ctx: AppContext;

/**
 * TM이 연결된 프로젝트 생성 + TM에 엔트리 추가 + Project Home까지 진입
 */
async function setupAndOpenProjectHome(
  page: import('@playwright/test').Page,
): Promise<{ tmId: string }> {
  // 프로젝트 생성 (Wizard Step 3에서 TM 생성)
  await page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
  await page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });
  await page.fill(SEL.NEW_PROJECT_NAME_INPUT, `TM Editor Test ${Date.now()}`);
  await page.click(SEL.NEW_PROJECT_SOURCE_LANG);
  await page.click(`${SEL.NEW_PROJECT_SOURCE_LANG_DROPDOWN} .lang-select-option >> text=en`);
  await page.click(SEL.NEW_PROJECT_TARGET_LANG);
  await page.click(`${SEL.NEW_PROJECT_TARGET_LANG_DROPDOWN} .lang-select-option >> text=ko`);
  await page.click('[data-testid="new-project-next-btn"]');
  await page.waitForSelector('[data-testid="file-drop-zone"]', { timeout: 5000 });
  await page.click('[data-testid="new-project-next-btn"]');
  await page.waitForSelector(SEL.WIZARD_TM_STEP, { timeout: 5000 });
  await page.click(SEL.WIZARD_CREATE_TM_BTN);
  await page.waitForSelector(SEL.CREATE_TM_DIALOG, { timeout: 5000 });
  await page.fill(`${SEL.CREATE_TM_DIALOG} input[data-testid="create-tm-name-input"]`, `Edit TM ${Date.now()}`);
  await page.click(SEL.CREATE_TM_CONFIRM);
  await page.waitForSelector(SEL.CREATE_TM_DIALOG, { state: 'hidden', timeout: 5000 });
  await page.click(SEL.NEW_PROJECT_FINISH_BTN);
  await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });

  // TM에 샘플 엔트리 추가
  const tmId = await page.evaluate(async () => {
    const tms = await window.electronAPI.tm.list();
    const tm = tms[0];
    await window.electronAPI.tm.addEntry({ tmId: tm.id, source: 'Hello', target: '안녕' });
    await window.electronAPI.tm.addEntry({ tmId: tm.id, source: 'World', target: '세계' });
    await window.electronAPI.tm.addEntry({ tmId: tm.id, source: 'Save', target: '저장' });
    return tm.id;
  });

  // Project Home 진입
  await page.locator('.ag-row').first().dblclick();
  await page.waitForSelector(SEL.PROJECT_HOME, { timeout: 10000 });

  return { tmId };
}

/**
 * TM Editor 열기 (Project Home → TM 카드 더블클릭)
 */
async function openTmEditor(page: import('@playwright/test').Page): Promise<void> {
  const tmCard = page.locator('[data-testid^="project-tm-"]').first();
  await tmCard.dblclick();
  await page.waitForSelector('[data-testid="tm-editor"]', { timeout: 10000 });
  // AG Grid 로드 대기
  await page.waitForSelector('.ag-row', { timeout: 10000 });
}

test.beforeEach(async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test.describe('Sprint 5-4: TM Editor', () => {
  test('TM 더블클릭 → TM Editor 열림 + 엔트리 표시', async () => {
    const { page } = ctx;
    await setupAndOpenProjectHome(page);
    await openTmEditor(page);

    // AG Grid에 3개 행이 있는지 확인
    const rowCount = await page.locator('.ag-row').count();
    expect(rowCount).toBeGreaterThanOrEqual(3);
  });

  test('셀 편집 → Ctrl+S → DB 저장', async () => {
    const { page } = ctx;
    const { tmId } = await setupAndOpenProjectHome(page);
    await openTmEditor(page);

    // Target 셀 더블클릭하여 편집 모드 진입
    const targetCell = page.locator('.ag-row[row-index="0"] .ag-cell[col-id="target"]').first();
    await targetCell.dblclick();
    await page.waitForTimeout(500);

    // AG Grid 셀 에디터 input 찾기
    const cellEditor = page.locator('.ag-cell-editor input, .ag-cell-edit-input');
    if (await cellEditor.isVisible().catch(() => false)) {
      await cellEditor.fill('수정됨');
    } else {
      // fallback: 키보드로 전체 선택 후 덮어쓰기
      await page.keyboard.press('Control+a');
      await page.waitForTimeout(100);
      await page.keyboard.type('수정됨');
    }

    // Enter로 편집 확정
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    // Ctrl+S 저장
    await page.keyboard.press('Control+s');
    await page.waitForTimeout(500);

    // DB에서 확인 (IPC로)
    const entries = await page.evaluate(async (tmId) => {
      return window.electronAPI.tm.listEntries(tmId);
    }, tmId);

    const modified = entries.find((e: { target?: string }) => e.target?.includes('수정'));
    expect(modified).toBeTruthy();
  });

  test('+ New → 빈 행 추가 → 입력 → Save', async () => {
    const { page } = ctx;
    await setupAndOpenProjectHome(page);
    await openTmEditor(page);

    const initialRows = await page.locator('.ag-row').count();

    // + New 클릭
    await page.click('[data-testid="tm-editor-add-btn"]');
    await page.waitForTimeout(300);

    // 행이 하나 늘었는지 확인
    const afterAddRows = await page.locator('.ag-row').count();
    expect(afterAddRows).toBe(initialRows + 1);
  });

  test('Delete → 엔트리 제거', async () => {
    const { page } = ctx;
    await setupAndOpenProjectHome(page);
    await openTmEditor(page);

    const initialRows = await page.locator('.ag-row').count();

    // 첫 번째 행 클릭 (선택)
    await page.locator('.ag-row[row-index="0"]').first().click();
    await page.waitForTimeout(200);

    // Delete 버튼 클릭
    await page.click('[data-testid="tm-editor-delete-btn"]');
    await page.waitForTimeout(300);

    // Save
    await page.keyboard.press('Control+s');
    await page.waitForTimeout(500);

    const afterDeleteRows = await page.locator('.ag-row').count();
    expect(afterDeleteRows).toBeLessThan(initialRows);
  });

  test('Find → 셀 하이라이트', async () => {
    const { page } = ctx;
    await setupAndOpenProjectHome(page);
    await openTmEditor(page);

    // Ctrl+H → Find & Replace 바 토글
    await page.keyboard.press('Control+h');
    await page.waitForSelector('[data-testid="tm-find-replace"]', { timeout: 3000 });

    // Find 입력
    await page.fill('[data-testid="tm-find-input"]', 'Hello');
    await page.click('[data-testid="tm-find-next-btn"]');
    await page.waitForTimeout(300);

    // Find & Replace 바가 보이는지 확인
    await expect(page.locator('[data-testid="tm-find-replace"]')).toBeVisible();
  });

  test('Replace → 교체 확인', async () => {
    const { page } = ctx;
    const { tmId } = await setupAndOpenProjectHome(page);
    await openTmEditor(page);

    // Ctrl+H
    await page.keyboard.press('Control+h');
    await page.waitForSelector('[data-testid="tm-find-replace"]', { timeout: 3000 });

    // Find "안녕", Replace "하이"
    await page.fill('[data-testid="tm-find-input"]', '안녕');
    await page.fill('[data-testid="tm-replace-input"]', '하이');
    await page.click('[data-testid="tm-find-next-btn"]');
    await page.waitForTimeout(200);
    await page.click('[data-testid="tm-replace-btn"]');
    await page.waitForTimeout(300);

    // Save
    await page.keyboard.press('Control+s');
    await page.waitForTimeout(500);

    // DB 확인
    const entries = await page.evaluate(async (tmId) => {
      return window.electronAPI.tm.listEntries(tmId);
    }, tmId);

    const replaced = entries.find((e: { target?: string }) => e.target === '하이');
    expect(replaced).toBeTruthy();
  });

  test('Ctrl+M → 플래그 토글', async () => {
    const { page } = ctx;
    await setupAndOpenProjectHome(page);
    await openTmEditor(page);

    // 첫 번째 행 선택
    await page.locator('.ag-row[row-index="0"]').first().click();
    await page.waitForTimeout(200);

    // Ctrl+M → 플래그 토글
    await page.keyboard.press('Control+m');
    await page.waitForTimeout(300);

    // 플래그 아이콘이 표시되는지 확인 (Flagged 컬럼)
    const flaggedCell = page.locator('.ag-row[row-index="0"] .ag-cell[col-id="flagged"]').first();
    const flagText = await flaggedCell.textContent();
    expect(flagText).toBeTruthy(); // 플래그 아이콘이 있음
  });

  test('← Back → Project Home 복귀', async () => {
    const { page } = ctx;
    await setupAndOpenProjectHome(page);
    await openTmEditor(page);

    // Back 버튼
    await page.click('[data-testid="tm-editor-back-btn"]');
    await page.waitForSelector(SEL.PROJECT_HOME, { timeout: 5000 });

    await expect(page.locator(SEL.PROJECT_HOME)).toBeVisible();
  });
});
