# Specification

## Summary
**Goal:** Remove the SVG icon from inside a specific header button in the Navbar component.

**Planned changes:**
- Remove the `<svg>` element (and its wrapping `<span>` if it becomes empty) from inside the first button in the header's top-left area of the Navbar
- Keep the button element itself intact

**User-visible outcome:** The header button no longer displays the SVG icon, with no broken layout or empty space left behind.
