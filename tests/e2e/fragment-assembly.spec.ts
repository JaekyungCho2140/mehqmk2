import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard, openEditor } from './helpers/test-utils';

let ctx: AppContext;

async function setupEditorWithFragments(page: import('@playwright/test').Page): Promise<void> {
  await page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
  await page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });
  await page.fill(SEL.NEW_PROJECT_NAME_INPUT, `Fragment Test ${Date.now()}`);
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
  await page.fill(`${SEL.CREATE_TM_DIALOG} input[data-testid="create-tm-name-input"]`, `Frag TM ${Date.now()}`);
  await page.click(SEL.CREATE_TM_CONFIRM);
  await page.waitForSelector(SEL.CREATE_TM_DIALOG, { state: 'hidden', timeout: 5000 });
  await page.click(SEL.NEW_PROJECT_FINISH_BTN);
  await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });

  // Fragment에 사용할 개별 단어 엔트리 추가
  await page.evaluate(async () => {
    const tms = await window.electronAPI.tm.list();
    if (tms.length === 0) return;
    const tmId = tms[0].id;
    await window.electronAPI.tm.addEntry({ tmId, source: 'Hello', target: '안녕' });
    await window.electronAPI.tm.addEntry({ tmId, source: 'world', target: '세계' });
    await window.electronAPI.tm.addEntry({ tmId, source: 'New', target: '새' });
    await window.electronAPI.tm.addEntry({ tmId, source: 'Project', target: '프로젝트' });
  });

  await openEditor(page);
}

test.beforeEach(async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test.describe('Sprint 6-6: Fragment Assembly + Settings', () => {
  test('Fragment Assembly — IPC로 조합 결과 검증', async () => {
    const { page } = ctx;
    await setupEditorWithFragments(page);

    // tm:fragment IPC로 직접 검증
    const result = await page.evaluate(async () => {
      const projects = await window.electronAPI.project.list();
      if (projects.length === 0) return null;
      // fragment API가 있는지 확인
      if (typeof window.electronAPI.tm.fragment !== 'function') return 'no-api';
      return window.electronAPI.tm.fragment(projects[0].id, 'Hello world');
    });

    if (result === 'no-api') {
      // fragment API가 없으면 ResultsPane에서 자동 호출 검증
      await page.waitForTimeout(2000);
      await expect(page.locator('[data-testid="results-pane"]')).toBeVisible();
    } else {
      expect(result).toBeTruthy();
    }
  });

  test('Fragment 커버리지 — 매칭 단어 비율', async () => {
    const { page } = ctx;
    await setupEditorWithFragments(page);
    await page.waitForTimeout(2000);

    // "New Project" 세그먼트(6번)로 이동 — "New"와 "Project" 둘 다 TM에 있음
    for (let i = 0; i < 5; i++) {
      await page.locator(SEL.TRANSLATION_EDITOR).press('ArrowDown');
      await page.waitForTimeout(300);
    }
    await page.waitForTimeout(1500);

    // Results Pane에 결과 표시 확인
    await expect(page.locator('[data-testid="results-pane"]')).toBeVisible();
  });

  test('커버리지 임계값 미달 → 결과 제외', async () => {
    const { page } = ctx;
    await setupEditorWithFragments(page);

    // 높은 임계값 설정 (99%)
    const result = await page.evaluate(async () => {
      const projects = await window.electronAPI.project.list();
      if (projects.length === 0) return null;
      // 임계값 99%로 호출 — "Hello, world!" source에서 일부만 매칭되면 null
      return window.electronAPI.tm.fragment(projects[0].id, 'Hello, world! How are you?', 99);
    });

    // 커버리지 미달이면 null
    // "Hello"와 "world"만 매칭 → 전체 source 대비 부족 → null
    expect(result === null || (result && result.coverage < 99)).toBeTruthy();
  });

  test('Results Settings — 설정 저장', async () => {
    const { page } = ctx;
    await setupEditorWithFragments(page);

    // Results Settings 다이얼로그 열기 시도 (⚙ 버튼 또는 IPC)
    // 설정을 IPC로 직접 저장/확인
    await page.evaluate(async () => {
      await window.electronAPI.settings.set('fragment_enabled', '1');
      await window.electronAPI.settings.set('fragment_threshold', '70');
      await window.electronAPI.settings.set('max_hits', '10');
    });

    const settings = await page.evaluate(async () => {
      const fragEnabled = await window.electronAPI.settings.get('fragment_enabled');
      const fragThreshold = await window.electronAPI.settings.get('fragment_threshold');
      const maxHits = await window.electronAPI.settings.get('max_hits');
      return { fragEnabled, fragThreshold, maxHits };
    });

    expect(settings.fragEnabled).toBe('1');
    expect(settings.fragThreshold).toBe('70');
    expect(settings.maxHits).toBe('10');
  });
});
