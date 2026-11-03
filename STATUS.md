# STATUS

## What was built

A freebies kit for first apartments: fillable, printable, no-account-needed
paperwork you can open in any browser and print or save as PDF. Local-first —
nothing is saved online and nothing leaves your computer.

Documents (fillable HTML in `html/`, Markdown sources in `kit/`):

- `html/budget-worksheet.html` + `kit/budget-worksheet.md`
  Monthly income vs. expenses, one-time move-in costs, auto-calculating
  totals, bottom-line money left over (negative warns about overspending).
- `html/supplies-checklist.html` + `kit/supplies-checklist.md`
  Room-by-room shopping list with printable checkboxes (cleaning, kitchen,
  bathroom, bedroom, living room, safety/paperwork).
- `html/furniture-list.html` + `kit/furniture-list.md`
  Room-by-room furniture list with priority (must have / nice to have),
  estimated vs. actual cost, status, and separate estimated/actual totals.
- `html/move-in-inspection.html` + `kit/move-in-inspection.md`
  Room-by-room condition checklist (good / needs repair / damaged), photo
  log, damage summary, tenant + landlord sign-off lines.
- `html/landlord-templates.html` + `kit/landlord-templates.md`
  Plain-English copy/paste templates: maintenance request, rent question,
  security deposit return, notice to vacate, lock/key request, noise/neighbor
  issue, move-out inspection request. Browser-built message preview + copy
  button.

Shared files:
- `css/kit.css` — screen styles plus `@media print` styles that hide controls
  and inputs for a clean paper copy.
- `scripts/verify.js` — Node verification script (structure, credit, license,
  secrets, workflows, JS logic).
- `README.md` — kit overview, how to use, about, license.
- `LICENSE` — MIT, Copyright (c) 2026 Asdale Dynamics, LLC.

## How to run

1. Open this folder in your file explorer.
2. Open any `html/*.html` file in a browser (Chrome, Firefox, Safari, Edge).
3. Fill in the fields on screen, or print blank and write by hand.
4. Press Ctrl+P / Cmd+P to print, or choose "Save as PDF."

Optionally run the verifier: `node scripts/verify.js`

No internet, account, signup, or personal data required.

## Verification results

- `node scripts/verify.js`: 0 failures (18 checks pass).
  - All 5 HTML files: DOCTYPE, html/head/body, title, kit.css link,
    Asdale Dynamics, LLC credit, no secrets.
  - `LICENSE` line 3 exactly: `Copyright (c) 2026 Asdale Dynamics, LLC`
  - `README.md` and all `kit/*.md` credit Asdale Dynamics, LLC.
  - No `.github/workflows` directory.
  - Budget `fmt()` handles positive, negative ($-X.XX for overspending), zero.
  - Furniture estimated vs. actual totals are computed separately (no double
    counting).
  - Landlord-templates `copy()` uses `textContent` (safe for `<div>` output).
- All 5 HTML files parse with balanced tags (Python html.parser).
- No build step required; plain HTML/CSS/JS opens directly in a browser.

## Known gaps

- Browser autofill may offer to save form data; that is the browser's choice,
  not this kit's — nothing is stored by the kit itself.
- State is not persisted across page reloads; print or screenshot to keep a
  copy.
- The landlord-templates copy button uses the Clipboard API with a
  range/selection fallback; very old browsers may need the manual fallback.
- These are planning/communication aids, not legal or financial advice.

## Credit

Created by Asdale Dynamics, LLC (Indiana, formed October 2026), founded by
Dylan Asdale. MIT License. Copyright (c) 2026 Asdale Dynamics, LLC.
