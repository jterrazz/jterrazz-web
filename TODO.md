# Backlog

- [ ] Apply the parked UI polish pass (`git stash list` → `better-ui: image outlines, accordion snap fix, …`): image edges, accordion interruption fix, TOC scroll motion, `transition-all` removals, icon crossfades, press feedback.
- [ ] `prefers-reduced-motion` is honoured nowhere except the showcase — every `motion` component needs the accessibility pass (`/better-accessibility`).
- [ ] `table-of-contents.tsx` still resolves parent/child scope with ~90 lines of nested index arithmetic — rebuild on a real tree model (journeys are the safety net).
- [ ] `@jterrazz/test`: `PageResult.status` reads as final-state but describes the entry document — fix or document upstream (found while writing the not-found journey).
- [ ] Consider aligning the `/content/*` public prefix with the `assets/` directory via 308s (decided against for now — see `docs/02-content.md`).
