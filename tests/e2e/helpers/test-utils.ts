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

  await page.click(SEL.NEW_PROJECT_FINISH_BTN);
  await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });
}
