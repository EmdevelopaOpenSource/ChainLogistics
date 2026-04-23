# Pull Request

## Description

This PR implements several key features from the issues backlog:

5. **Frontend Security: Input Validation (#246):**
   - Standardized form handling using `react-hook-form` and `Zod`.
   - Refactored `InvoiceForm`, `EventTrackingForm`, and `ProductRegistrationForm` with robust validation.
   - Improved accessibility and real-time feedback for users.

6. **Frontend Performance Optimizations (#251, #252):**
   - Implemented route-based code splitting using `next/dynamic` for large components.
   - Verified SVG-based image strategy for optimal performance and scalability.

7. **Dependency Security Audit (#247):**
   - Performed comprehensive audit and resolved all detected vulnerabilities.
   - Force-updated standard frameworks (Next.js) to their latest secure versions.

## Checks
- [x] Tested locally.
- [x] All PR checks (lint/tests) passed.
- [x] Fixed unit test expectations and handled Stellar SDK validation mocks.
- [x] Adhered to ESLint rules and handled hydration state correctly in LanguageSelector.
- [x] Dependencies are installed.

## Related Issues

- Closes #246
- Closes #251
- Closes #252
- Closes #247
