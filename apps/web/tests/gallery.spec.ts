import { test, expect } from '@playwright/test'

test.describe('Gallery & Lightbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/photography')
  })

  // ─── Gallery rendering ───────────────────────────────────────────────────────

  test('photography page renders without errors', async ({ page }) => {
    await expect(page).not.toHaveURL(/\/404/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('filter tabs are visible', async ({ page }) => {
    // Category filter bar should render
    // Filters are rendered as <a> links, not buttons
    await expect(page.getByRole('link', { name: 'All' }).first()).toBeVisible()
  })

  // ─── Lightbox — open ─────────────────────────────────────────────────────────

  test('clicking a project card opens the lightbox', async ({ page }) => {
    // Wait for images to load
    const firstCard = page.locator('button[aria-label^="View"]').first()

    // If there are no seeded projects, the gallery may be empty — skip gracefully
    const cardCount = await firstCard.count()
    test.skip(cardCount === 0, 'No project cards found — seed Sanity data first')

    await firstCard.click()

    // Lightbox overlay should appear
    await expect(page.locator('[role="dialog"], [data-lightbox]').first()).toBeVisible({
      timeout: 3000,
    })
  })

  test('lightbox shows project title', async ({ page }) => {
    const firstCard = page.locator('button[aria-label^="View"]').first()
    test.skip((await firstCard.count()) === 0, 'No project cards found')

    const cardLabel = await firstCard.getAttribute('aria-label')
    await firstCard.click()

    if (cardLabel) {
      const projectTitle = cardLabel.replace(/^View\s+/i, '')
      await expect(
        page.locator('[role="dialog"]').getByRole('heading', { name: projectTitle })
      ).toBeVisible({ timeout: 3000 })
    }
  })

  // ─── Lightbox — keyboard navigation ─────────────────────────────────────────

  test('Escape key closes the lightbox', async ({ page }) => {
    const firstCard = page.locator('button[aria-label^="View"]').first()
    test.skip((await firstCard.count()) === 0, 'No project cards found')

    await firstCard.click()
    await expect(page.locator('[role="dialog"], [data-lightbox]').first()).toBeVisible({
      timeout: 3000,
    })

    await page.keyboard.press('Escape')

    await expect(page.locator('[role="dialog"], [data-lightbox]').first()).not.toBeVisible({
      timeout: 2000,
    })
  })

  test('ArrowRight advances to the next image', async ({ page }) => {
    const cards = page.locator('button[aria-label^="View"]')
    test.skip((await cards.count()) < 2, 'Need at least 2 projects to test navigation')

    await cards.first().click()
    await expect(page.locator('[role="dialog"], [data-lightbox]').first()).toBeVisible()

    // Capture current title before advancing
    const titleBefore = await page.locator('[role="dialog"] h2, [role="dialog"] h3').first().textContent()

    await page.keyboard.press('ArrowRight')

    const titleAfter = await page.locator('[role="dialog"] h2, [role="dialog"] h3').first().textContent()
    // Title should have changed if there are multiple images
    expect(titleAfter).not.toBe(titleBefore)
  })

  test('ArrowLeft goes back to the previous image', async ({ page }) => {
    const cards = page.locator('button[aria-label^="View"]')
    test.skip((await cards.count()) < 2, 'Need at least 2 projects to test navigation')

    // Open at second card
    await cards.nth(1).click()
    await expect(page.locator('[role="dialog"], [data-lightbox]').first()).toBeVisible()

    const titleAtSecond = await page.locator('[role="dialog"] h2, [role="dialog"] h3').first().textContent()

    await page.keyboard.press('ArrowLeft')

    const titleAtFirst = await page.locator('[role="dialog"] h2, [role="dialog"] h3').first().textContent()
    expect(titleAtFirst).not.toBe(titleAtSecond)
  })

  // ─── Lightbox — close button ─────────────────────────────────────────────────

  test('close button dismisses the lightbox', async ({ page }) => {
    const firstCard = page.locator('button[aria-label^="View"]').first()
    test.skip((await firstCard.count()) === 0, 'No project cards found')

    await firstCard.click()
    await expect(page.locator('[role="dialog"], [data-lightbox]').first()).toBeVisible({
      timeout: 3000,
    })

    const closeBtn = page.locator('[role="dialog"]').getByRole('button', { name: /close/i })
    await closeBtn.click()

    await expect(page.locator('[role="dialog"], [data-lightbox]').first()).not.toBeVisible({
      timeout: 2000,
    })
  })

  // ─── Category filters ────────────────────────────────────────────────────────

  test('clicking a category filter updates the URL', async ({ page }) => {
    const portraitFilter = page.locator('a[href*="category=portrait"]')
    const filterCount = await portraitFilter.count()
    test.skip(filterCount === 0, 'Portrait filter not found')

    await portraitFilter.click()

    await expect(page).toHaveURL(/category=portrait/)
  })

  // ─── Accessibility ───────────────────────────────────────────────────────────

  test('lightbox traps focus while open', async ({ page }) => {
    const firstCard = page.locator('button[aria-label^="View"]').first()
    test.skip((await firstCard.count()) === 0, 'No project cards found')

    await firstCard.click()
    await expect(page.locator('[role="dialog"], [data-lightbox]').first()).toBeVisible()

    // Tab through all focusable elements; focus should stay inside the dialog
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      const focused = await page.evaluate(() => document.activeElement?.closest('[role="dialog"]'))
      expect(focused).not.toBeNull()
    }
  })
})
