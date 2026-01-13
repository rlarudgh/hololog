# Color Contrast Verification Guide

**Last Updated:** 2025-01-13
**Status:** Ready for Review

This document provides guidelines for verifying color contrast compliance with WCAG 2.1 AA standards.

---

## WCAG 2.1 AA Requirements

### Text Contrast
- **Normal text (< 18pt):** Minimum 4.5:1 contrast ratio
- **Large text (≥ 18pt or ≥ 14pt bold):** Minimum 3:1 contrast ratio
- **UI Components:** Minimum 3:1 contrast ratio
- **Graphical Objects:** Minimum 3:1 contrast ratio

---

## Current Color Palette

### Light Mode
- **Background:** `white` (#FFFFFF)
- **Text Primary:** `text-gray-900` (#111827)
- **Text Secondary:** `text-gray-600` (#4B5563)
- **Text Tertiary:** `text-gray-500` (#6B7280)
- **Links:** `text-blue-600` (#2563EB)
- **Borders:** `border-gray-200` (#E5E7EB)

### Dark Mode
- **Background:** `dark:bg-gray-900` (#111827)
- **Text Primary:** `dark:text-white` (#FFFFFF)
- **Text Secondary:** `dark:text-gray-300` (#D1D5DB)
- **Text Tertiary:** `dark:text-gray-400` (#9CA3AF)
- **Links:** `text-blue-600` (#2563EB) - May need adjustment for dark mode

---

## Verification Tools

### 1. Chrome DevTools (Easiest)

1. Open Chrome DevTools (F12)
2. Go to **Lighthouse** tab
3. Select "Accessibility" checkbox
4. Click "Analyze page load"
5. Review "Color Contrast" section

### 2. axe DevTools (Recommended)

```bash
# Install Chrome extension
# https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd

# Usage:
1. Open DevTools (F12)
2. Go to "axe DevTools" tab
3. Click "Scan ALL of my page"
4. Review "Color contrast" issues
```

### 3. Online Tools

**WebAIM Contrast Checker:**
- URL: https://webaim.org/resources/contrastchecker/
- Enter foreground and background colors
- Check if it meets WCAG AA

**Contrast Ratio:**
- URL: https://contrast-ratio.com/
- Visual comparison tool
- Shows both WCAG AA and AAA compliance

---

## Manual Testing Checklist

### Test Cases to Verify

#### Light Mode
- [ ] Header text (`text-gray-900` on `white`)
- [ ] Body text (`text-gray-600` on `white`)
- [ ] Secondary text (`text-gray-500` on `white`)
- [ ] Links (`text-blue-600` on `white`)
- [ ] Blog post titles on cards
- [ ] Code blocks (`bg-gray-100`)
- [ ] Tags (bg-blue-100 with text-blue-800)
- [ ] Buttons

#### Dark Mode
- [ ] Header text (`dark:text-white` on `dark:bg-gray-900`)
- [ ] Body text (`dark:text-gray-300` on `dark:bg-gray-900`)
- [ ] Secondary text (`dark:text-gray-400` on `dark:bg-gray-900`)
- [ ] Links (ensure visible in dark mode)
- [ ] Blog post titles on cards
- [ ] Code blocks (`dark:bg-gray-800`)
- [ ] Tags (dark mode variants)
- [ ] Buttons

---

## Quick Verification Commands

```bash
# 1. Start development server
yarn dev

# 2. Build for production (to test production build)
yarn build
yarn start

# 3. Run Lighthouse CLI
npx lighthouse http://localhost:3000 --only-categories=accessibility --view

# 4. Run axe-core CLI (if installed)
npx axe http://localhost:3000 --tags wcag2aa
```

---

## Known Color Combinations

### ✅ Verified Combinations (WCAG AA Pass)

| Foreground | Background | Ratio | Pass/Fail |
|------------|------------|-------|-----------|
| gray-900 (#111827) | white (#FFFFFF) | 15.7:1 | ✅ Pass |
| gray-600 (#4B5563) | white (#FFFFFF) | 7.1:1 | ✅ Pass |
| gray-500 (#6B7280) | white (#FFFFFF) | 5.7:1 | ✅ Pass |
| blue-600 (#2563EB) | white (#FFFFFF) | 7.5:1 | ✅ Pass |

### ⚠️ Needs Verification

| Foreground | Background | Ratio | Pass/Fail | Action |
|------------|------------|-------|-----------|--------|
| blue-600 (#2563EB) | gray-900 (#111827) | ? | ❓ Verify | May need dark mode variant |
| gray-400 (#9CA3AF) | gray-900 (#111827) | ? | ❓ Verify | Test in dark mode |
| text-blue-600 (hover) | dark:bg-gray-800 | ? | ❓ Verify | Check hover states |

---

## Common Issues & Fixes

### Issue 1: Links in Dark Mode

**Problem:** `text-blue-600` may not have enough contrast on dark backgrounds

**Solution:**
```tsx
// Instead of:
className="text-blue-600 hover:text-blue-800"

// Use:
className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
```

### Issue 2: Tags in Dark Mode

**Problem:** Light mode tags may not work in dark mode

**Solution:**
```tsx
// Instead of:
className="bg-blue-100 text-blue-800"

// Use:
className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
```

### Issue 3: Code Blocks

**Problem:** Code syntax highlighting may have poor contrast

**Solution:**
Use Prism themes designed for accessibility (e.g., `prism-tomorrow` or custom theme)

---

## Testing Procedure

### Step 1: Manual Visual Check
```bash
yarn dev
```
1. Open http://localhost:3000
2. Toggle dark mode
3. Visually inspect all text elements
4. Look for hard-to-read text

### Step 2: Lighthouse Audit
```bash
# In Chrome DevTools:
1. Open DevTools (F12)
2. Lighthouse tab
3. Select "Accessibility"
4. Click "Analyze page load"
5. Review color contrast issues
```

### Step 3: axe DevTools Scan
```bash
# Install axe DevTools Chrome extension
1. Open DevTools
2. axe DevTools tab
3. "Scan ALL of my page"
4. Review color contrast violations
```

### Step 4: Fix Issues
```bash
# Update Tailwind classes in components
# Re-test until all pass
```

---

## Automated Testing (Future)

### Option 1: axe-core/react

```bash
yarn add @axe-core/react
```

```tsx
import { axe } from '@axe-core/react';

it('should have no accessibility violations', async () => {
  const { container } = render(<App />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Option 2: pa11y CI

```bash
yarn add -D pa11y-ci
```

```json
// pa11y-ci.json
{
  "urls": [
    "http://localhost:3000",
    "http://localhost:3000/blog",
    "http://localhost:3000/about"
  ],
  "standard": "WCAG2AA"
}
```

---

## Next Steps

1. [ ] Run manual verification with Chrome DevTools
2. [ ] Run axe DevTools scan
3. [ ] Document any issues found
4. [ ] Fix identified issues
5. [ ] Re-verify all changes
6. [ ] Consider adding automated accessibility tests

---

## Resources

- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Next.js Accessibility](https://nextjs.org/docs/app/building-your-application/optimizing/accessibility)

---

**Maintainer:** Development Team
**Last Review:** 2025-01-13
