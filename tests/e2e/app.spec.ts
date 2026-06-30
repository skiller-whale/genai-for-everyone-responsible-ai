import { test, expect, type Page } from '@playwright/test';

const USE_CASES = [
  { id: 'uc-1', text: 'Students use it to learn French.', category: 'intended' },
  { id: 'uc-2', text: 'Propagandists use it to spread misinformation.', category: 'misuse' },
];

const STAKEHOLDERS = [
  { id: 'sh-1', text: 'Immigrant', type: 'direct', useCaseId: 'uc-1' },
  { id: 'sh-2', text: 'Aid worker', type: 'indirect', useCaseId: 'uc-1' },
];

const HARMS = [
  {
    id: 'h-1',
    text: 'Immigrants may lose opportunities due to translation errors.',
    harmType: 'Opportunity loss',
    severity: 'severe',
    stakeholderId: 'sh-1',
  },
  {
    id: 'h-2',
    text: 'Immigrants may have privacy violated.',
    harmType: 'Privacy violations',
    severity: 'very severe',
    stakeholderId: 'sh-1',
  },
];

async function mockApis(page: Page) {
  await page.route('/api/use-cases', (route) => route.fulfill({ json: USE_CASES }));
  await page.route('/api/stakeholders', (route) => route.fulfill({ json: STAKEHOLDERS }));
  await page.route('/api/harms', (route) => route.fulfill({ json: HARMS }));
}

test.beforeEach(async ({ page }) => {
  await mockApis(page);
  await page.goto('/');
});

test('renders four column headers', async ({ page }) => {
  await expect(page.locator('.column-header', { hasText: 'Functionality' })).toBeVisible();
  await expect(page.locator('.column-header', { hasText: 'Use Cases' })).toBeVisible();
  await expect(page.locator('.column-header', { hasText: 'Stakeholders' })).toBeVisible();
  await expect(page.locator('.column-header', { hasText: 'Harms' })).toBeVisible();
});

test('shows functionality textarea and generate button', async ({ page }) => {
  await expect(page.getByPlaceholder(/describe/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /generate use cases/i })).toBeVisible();
});

test('generate button is disabled when input is empty', async ({ page }) => {
  await expect(page.getByRole('button', { name: /generate use cases/i })).toBeDisabled();
});

test('generates use cases after typing functionality', async ({ page }) => {
  await page.getByPlaceholder(/describe/i).fill('Translate a sentence from English to French');
  await page.getByRole('button', { name: /generate use cases/i }).click();
  await expect(page.getByText('Students use it to learn French.')).toBeVisible();
  await expect(page.getByText('Propagandists use it to spread misinformation.')).toBeVisible();
});

test('shows stakeholder hint before selecting a use case', async ({ page }) => {
  await expect(page.getByText(/select a use case/i)).toBeVisible();
});

test('generates stakeholders after clicking a use case', async ({ page }) => {
  await page.getByPlaceholder(/describe/i).fill('Translate text');
  await page.getByRole('button', { name: /generate use cases/i }).click();
  await page.getByText('Students use it to learn French.').click();
  await expect(page.getByText('Immigrant')).toBeVisible();
  await expect(page.getByText('Aid worker')).toBeVisible();
});

test('generates harms after clicking a stakeholder', async ({ page }) => {
  await page.getByPlaceholder(/describe/i).fill('Translate text');
  await page.getByRole('button', { name: /generate use cases/i }).click();
  await page.getByText('Students use it to learn French.').click();
  await page.getByText('Immigrant').click();
  await expect(page.getByText('Immigrants may lose opportunities due to translation errors.')).toBeVisible();
});

test('shows harm hint before selecting a stakeholder', async ({ page }) => {
  await page.getByPlaceholder(/describe/i).fill('Translate text');
  await page.getByRole('button', { name: /generate use cases/i }).click();
  await expect(page.getByText(/select a stakeholder/i)).toBeVisible();
});

test('can edit a card by double-clicking', async ({ page }) => {
  await page.getByPlaceholder(/describe/i).fill('Translate text');
  await page.getByRole('button', { name: /generate use cases/i }).click();

  const card = page.locator('[data-card-id="uc-1"]');
  await card.dblclick();
  const textarea = card.locator('textarea');
  await expect(textarea).toBeVisible();
  await textarea.fill('Updated use case text.');
  await page.keyboard.press('Escape');
  await expect(card).toContainText('Students use it to learn French.');
});

test('can save card edit by pressing Enter', async ({ page }) => {
  await page.getByPlaceholder(/describe/i).fill('Translate text');
  await page.getByRole('button', { name: /generate use cases/i }).click();

  const card = page.locator('[data-card-id="uc-1"]');
  await card.dblclick();
  const textarea = card.locator('textarea');
  await textarea.fill('My new text.');
  await page.keyboard.press('Enter');
  await expect(card).toContainText('My new text.');
});

test('can delete a use case card', async ({ page }) => {
  await page.getByPlaceholder(/describe/i).fill('Translate text');
  await page.getByRole('button', { name: /generate use cases/i }).click();

  const card = page.locator('[data-card-id="uc-1"]');
  await card.hover();
  await card.locator('.card-delete').click();
  await expect(page.getByText('Students use it to learn French.')).not.toBeVisible();
});

test('What else button generates more use cases', async ({ page }) => {
  const moreCases = [{ id: 'uc-3', text: 'New use case.', category: 'intended' }];
  let callCount = 0;
  await page.route('/api/use-cases', (route) => {
    callCount++;
    route.fulfill({ json: callCount === 1 ? USE_CASES : moreCases });
  });

  await page.goto('/');
  await page.getByPlaceholder(/describe/i).fill('Translate text');
  await page.getByRole('button', { name: /generate use cases/i }).click();
  await page.getByText('What else?').first().click();
  await expect(page.getByText('New use case.')).toBeVisible();
  expect(callCount).toBe(2);
});

test('Who else button generates more stakeholders', async ({ page }) => {
  const moreStakeholders = [
    { id: 'sh-3', text: 'Journalist', type: 'indirect', useCaseId: 'uc-1' },
  ];
  let stakeholderCallCount = 0;
  await page.route('/api/stakeholders', (route) => {
    stakeholderCallCount++;
    route.fulfill({ json: stakeholderCallCount === 1 ? STAKEHOLDERS : moreStakeholders });
  });

  await page.goto('/');
  await page.getByPlaceholder(/describe/i).fill('Translate text');
  await page.getByRole('button', { name: /generate use cases/i }).click();
  await page.getByText('Students use it to learn French.').click();
  await page.getByText('Who else?').click();
  await expect(page.getByText('Journalist')).toBeVisible();
});
