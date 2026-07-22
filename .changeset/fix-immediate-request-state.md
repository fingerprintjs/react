---
'@fingerprint/react': minor
---

Behavior bug fixes:

- Stale automatic `useVisitorData` requests no longer overwrite newer state. 
- Loading state is now correctly synchronized when `immediate` changes.

We recommend to double-check that your implementation isn't relying on the previous incorrect behavior when upgrading. 
