import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { completeWizard } from './helpers/test-utils';
import { SEL } from './helpers/selectors';

let ctx: AppContext;

/**
 * 프로젝트 + TM 생성 (renderer IPC 사용)
 */
async function createProjectAndTm(
  page: import('@playwright/test').Page,
): Promise<{ projectId: string; tmId: string }> {
  await page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
  await page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });
  await page.fill(SEL.NEW_PROJECT_NAME_INPUT, `Match Test ${Date.now()}`);
  await page.click(SEL.NEW_PROJECT_SOURCE_LANG);
  await page.click(`${SEL.NEW_PROJECT_SOURCE_LANG_DROPDOWN} .lang-select-option >> text=en`);
  await page.click(SEL.NEW_PROJECT_TARGET_LANG);
  await page.click(`${SEL.NEW_PROJECT_TARGET_LANG_DROPDOWN} .lang-select-option >> text=ko`);
  await page.click('[data-testid="new-project-next-btn"]');
  await page.waitForSelector('[data-testid="file-drop-zone"]', { timeout: 5000 });
  await page.click(SEL.NEW_PROJECT_FINISH_BTN);
  await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });

  return page.evaluate(async () => {
    const projects = await window.electronAPI.project.list();
    const project = projects[0];
    const tm = await window.electronAPI.tm.create({
      name: `TM ${Date.now()}`,
      source_lang: 'en',
      target_lang: 'ko',
    });
    await window.electronAPI.tm.linkToProject(project.id, tm.id, 'working');
    return { projectId: project.id, tmId: tm.id };
  });
}

test.beforeEach(async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test.describe('Sprint 5-2: TM Match Scoring 엔진', () => {
  test('Exact match — 동일 source 검색 → 100%', async () => {
    const { page } = ctx;
    const { projectId, tmId } = await createProjectAndTm(page);

    await page.evaluate(
      async ({ tmId }) => {
        await window.electronAPI.tm.addEntry({
          tmId,
          source: 'Hello world',
          target: '안녕하세요 세계',
        });
      },
      { tmId },
    );

    const matches = await page.evaluate(
      async ({ projectId }) =>
        window.electronAPI.tm.search({ projectId, source: 'Hello world' }),
      { projectId },
    );

    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches[0].match_rate).toBe(100);
    expect(matches[0].match_type).toBe('exact');
    expect(matches[0].target).toBe('안녕하세요 세계');
  });

  test('Context match — prev/next 일치 → 101%', async () => {
    const { page } = ctx;
    const { projectId, tmId } = await createProjectAndTm(page);

    await page.evaluate(
      async ({ tmId }) => {
        await window.electronAPI.tm.addEntry({
          tmId,
          source: 'Save file',
          target: '파일 저장',
          prevSource: 'Open file',
          nextSource: 'Close file',
        });
      },
      { tmId },
    );

    const matches = await page.evaluate(
      async ({ projectId }) =>
        window.electronAPI.tm.search({
          projectId,
          source: 'Save file',
          prevSource: 'Open file',
        }),
      { projectId },
    );

    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches[0].match_rate).toBe(101);
    expect(matches[0].match_type).toBe('context');
  });

  test('Context match — double context → 102%', async () => {
    const { page } = ctx;
    const { projectId, tmId } = await createProjectAndTm(page);

    await page.evaluate(
      async ({ tmId }) => {
        await window.electronAPI.tm.addEntry({
          tmId,
          source: 'Edit text',
          target: '텍스트 편집',
          prevSource: 'Select all',
          nextSource: 'Copy text',
        });
      },
      { tmId },
    );

    const matches = await page.evaluate(
      async ({ projectId }) =>
        window.electronAPI.tm.search({
          projectId,
          source: 'Edit text',
          prevSource: 'Select all',
          nextSource: 'Copy text',
        }),
      { projectId },
    );

    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches[0].match_rate).toBe(102);
    expect(matches[0].match_type).toBe('double-context');
  });

  test('Number substitution — 숫자만 다른 경우 100% + 치환', async () => {
    const { page } = ctx;
    const { projectId, tmId } = await createProjectAndTm(page);

    await page.evaluate(
      async ({ tmId }) => {
        await window.electronAPI.tm.addEntry({
          tmId,
          source: 'There are 10 items',
          target: '10개 항목 있습니다',
        });
      },
      { tmId },
    );

    const matches = await page.evaluate(
      async ({ projectId }) =>
        window.electronAPI.tm.search({ projectId, source: 'There are 15 items' }),
      { projectId },
    );

    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches[0].match_rate).toBe(100);
    expect(matches[0].target).toContain('15');
    expect(matches[0].penalties).toContain('number-substitution');
  });

  test('Fuzzy match — 유사 텍스트 50-99%', async () => {
    const { page } = ctx;
    const { projectId, tmId } = await createProjectAndTm(page);

    await page.evaluate(
      async ({ tmId }) => {
        await window.electronAPI.tm.addEntry({
          tmId,
          source: 'Hello world',
          target: '안녕하세요 세계',
        });
      },
      { tmId },
    );

    const matches = await page.evaluate(
      async ({ projectId }) =>
        window.electronAPI.tm.search({ projectId, source: 'Hello worl' }),
      { projectId },
    );

    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches[0].match_rate).toBeGreaterThanOrEqual(50);
    expect(matches[0].match_rate).toBeLessThan(100);
    expect(matches[0].match_type).toBe('fuzzy');
  });

  test('빈 TM에서 검색 → 결과 없음', async () => {
    const { page } = ctx;
    const { projectId } = await createProjectAndTm(page);

    const matches = await page.evaluate(
      async ({ projectId }) =>
        window.electronAPI.tm.search({ projectId, source: 'Anything' }),
      { projectId },
    );

    expect(matches.length).toBe(0);
  });

  test('매치 정렬 — 동률 시 Working > Master', async () => {
    const { page } = ctx;

    await page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
    await page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });
    await page.fill(SEL.NEW_PROJECT_NAME_INPUT, `Sort Test ${Date.now()}`);
    await page.click(SEL.NEW_PROJECT_SOURCE_LANG);
    await page.click(`${SEL.NEW_PROJECT_SOURCE_LANG_DROPDOWN} .lang-select-option >> text=en`);
    await page.click(SEL.NEW_PROJECT_TARGET_LANG);
    await page.click(`${SEL.NEW_PROJECT_TARGET_LANG_DROPDOWN} .lang-select-option >> text=ko`);
    await page.click('[data-testid="new-project-next-btn"]');
    await page.waitForSelector('[data-testid="file-drop-zone"]', { timeout: 5000 });
    await page.click(SEL.NEW_PROJECT_FINISH_BTN);
    await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });

    const result = await page.evaluate(async () => {
      const projects = await window.electronAPI.project.list();
      const project = projects[0];

      const workingTm = await window.electronAPI.tm.create({
        name: `Working ${Date.now()}`,
        source_lang: 'en',
        target_lang: 'ko',
      });
      const masterTm = await window.electronAPI.tm.create({
        name: `Master ${Date.now()}`,
        source_lang: 'en',
        target_lang: 'ko',
      });

      await window.electronAPI.tm.linkToProject(project.id, workingTm.id, 'working');
      await window.electronAPI.tm.linkToProject(project.id, masterTm.id, 'master');

      return { projectId: project.id, workingTmId: workingTm.id, masterTmId: masterTm.id };
    });

    // 양쪽 TM에 같은 source 엔트리 추가
    await page.evaluate(
      async ({ workingTmId, masterTmId }) => {
        await window.electronAPI.tm.addEntry({
          tmId: workingTmId,
          source: 'Sort test',
          target: '정렬 테스트 W',
        });
        await window.electronAPI.tm.addEntry({
          tmId: masterTmId,
          source: 'Sort test',
          target: '정렬 테스트 M',
        });
      },
      { workingTmId: result.workingTmId, masterTmId: result.masterTmId },
    );

    const matches = await page.evaluate(
      async ({ projectId }) =>
        window.electronAPI.tm.search({ projectId, source: 'Sort test' }),
      { projectId: result.projectId },
    );

    expect(matches.length).toBe(2);
    expect(matches[0].tm_role).toBe('working');
    expect(matches[1].tm_role).toBe('master');
  });
});
