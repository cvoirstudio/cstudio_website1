import { test, expect } from '@playwright/test'

const NAV_LINKS = [
  { label: 'Photography', href: '/photography' },
  { label: 'Web Development', href: '/web-development' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('homepage loads without errors', async ({ page }) => {
    await expect(page).not.toHaveURL(/\/404/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('nav is visible on load', async ({ page }) => {
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  for (const { label, href } of NAV_LINKS) {
    test(`${label} link resolves without 404`, async ({ page }) => {
      await page.goto(href)
      await expect(page).not.toHaveURL(/\/404/)
      await expect(page.locator('main, article, section').first()).toBeVisible()
    })
  }

  test('clicking Photography nav link navigates correctly', async ({ page }) => {
    const anchor = page.getByRole('link', { name: 'Photography' }).first()
    await anchor.click()
    await expect(page).toHaveURL('/photography')
  })

  test('clicking logo navigates to homepage', async ({ page }) => {
    await page.goto('/about')
    const logo = page.getByRole('link', { name: /cvoir/i }).first()
    await logo.click()
    await expect(page).toHaveURL('/')
  })

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    const menuButton = page.getByRole('button', { name: /menu|open/i })
    await menuButton.click()

    // Menu items should be visible
    await expect(page.getByRole('link', { name: 'Photography' })).toBeVisible()

    // Close the menu
    const closeButton = page.getByRole('button', { name: /close/i })
    await closeButton.click()

    // Menu should be dismissed
    await expect(page.getByRole('link', { name: 'Photography' })).not.toBeVisible()
  })

  test('footer links do not 404', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    const footerLinks = footer.getByRole('link')
    const count = await footerLinks.count()

    for (let i = 0; i < count; i++) {
      const href = await footerLinks.nth(i).getAttribute('href')
      if (!href || href.startsWith('http') || href.startsWith('mailto') || href === '#') continue

      await page.goto(href)
      await expect(page).not.toHaveURL(/\/404/)
      await page.goto('/')
    }
  })

  test('nav becomes opaque after scrolling', async ({ page }) => {
    // Scroll past the 80px threshold that triggers the frosted-glass style
    await page.evaluate(() => window.scrollTo(0, 200))
    await page.waitForTimeout(100)

    const nav = page.locator('nav')
    const bgClass = await nav.getAttribute('class')
    // After scroll, should have backdrop/bg class applied
    expect(bgClass).toMatch(/bg-|backdrop/)
  })
})
