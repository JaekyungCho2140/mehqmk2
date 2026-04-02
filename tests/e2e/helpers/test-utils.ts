import type { Page } from '@playwright/test';
import { SEL } from './selectors';

/**
 * Welcome Wizard를 완료하여 Dashboard에 도달
 */
export async function completeWizard(page: Page): Promise<void> {
  await page.waitForSelector(SEL.WIZARD_CONTAINER, { timeout: 10000 });
  await page.fill(SEL.STEP_USERNAME_INPUT, 'TestUser');
  await page.click(SEL.WIZARD_NEXT_BTN);
  await page.click(SEL.WIZARD_FINISH_BTN);
  await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });
}

/**
 * 프로젝트 생성 (Dashboard에서 시작)
 */
export async function createProject(
  page: Page,
  options: {
    name: string;
    sourceLang?: string;
    targetLang?: string;
    client?: string;
  },
): Promise<void> {
  await page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
  await page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });

  await page.fill(SEL.NEW_PROJECT_NAME_INPUT, options.name);

  // Source language 선택
  await page.click(SEL.NEW_PROJECT_SOURCE_LANG);
  const sourceCode = options.sourceLang ?? 'ko';
  await page.click(
    `${SEL.NEW_PROJECT_SOURCE_LANG_DROPDOWN} .lang-select-option >> text=${sourceCode}`,
  );

  // Target language 선택
  await page.click(SEL.NEW_PROJECT_TARGET_LANG);
  const targetCode = options.targetLang ?? 'en';
  await page.click(
    `${SEL.NEW_PROJECT_TARGET_LANG_DROPDOWN} .lang-select-option >> text=${targetCode}`,
  );

  if (options.client) {
    await page.fill(SEL.NEW_PROJECT_CLIENT_INPUT, options.client);
  }

  // Step 1(Details) → Next → Step 2(Documents) → Finish
  await page.click('[data-testid="new-project-next-btn"]');
  await page.waitForSelector('[data-testid="file-drop-zone"]', { timeout: 5000 });
  await page.click(SEL.NEW_PROJECT_FINISH_BTN);
  await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });
}

/**
 * 에디터 진입 (Dashboard → Project Home → Editor)
 * 사전 조건: Dashboard에 프로젝트가 1개 이상 있어야 함
 */
export async function openEditor(page: Page): Promise<void> {
  // 프로젝트 더블클릭 → Project Home
  await page.locator('.ag-row').first().dblclick();
  await page.waitForSelector(SEL.PROJECT_HOME, { timeout: 10000 });

  // Open in Editor
  await page.click(SEL.OPEN_EDITOR_BTN);
  await page.waitForSelector(SEL.TRANSLATION_EDITOR, { timeout: 10000 });

  // AG Grid 행 로드 대기
  await page.waitForSelector('.ag-row', { timeout: 10000 });

  // TipTap 에디터 준비 대기
  await page.waitForSelector(`${SEL.TIPTAP_EDITOR} .tiptap`, { timeout: 5000 });
}

/**
 * 프로젝트 이름으로 DB에서 ID를 조회한 후, 문서를 Import (파일 다이얼로그 우회)
 */
export async function importDocumentViaIpc(
  electronApp: import('@playwright/test').ElectronApplication,
  projectName: string,
  filePath: string,
): Promise<void> {
  const page = await electronApp.firstWindow();
  const escapedPath = filePath.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  // 프로젝트 목록에서 이름으로 ID 조회
  const projectId = await page.evaluate(async (name) => {
    const projects = await window.electronAPI.project.list();
    const project = projects.find((p) => p.name === name);
    return project?.id ?? null;
  }, projectName);

  if (!projectId) throw new Error(`프로젝트 '${projectName}'을 찾을 수 없습니다`);

  await page.evaluate(([pid, fp]) => window.electronAPI.document.import(pid, fp), [
    projectId,
    escapedPath,
  ] as const);
}
