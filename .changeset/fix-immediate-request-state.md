---
'@fingerprint/react': minor
---

Behavior bug fixes:

- Stale automatic `useVisitorData` requests (when `immediate` changes from `true` to `false` during an automatic request) no longer overwrite state (the result is ignored).
- Loading state is now correctly synchronized when `immediate` changes.

We recommend double-checking that your implementation isn't relying on the previous incorrect behavior when upgrading. 
