# Historical homepage checks

The `*.legacy.ts` files preserve tests for the retired Pixi WorldHome, portrait directory, toys and automatic voyage. The public `/` route now renders ArchipelagoHome, so these files are not release tests and deliberately do not use the `.spec.ts` suffix.

Current homepage behavior is covered by `rigid-world.spec.ts`, `background.spec.ts`, `smoke.spec.ts` and `release.spec.ts`: aggregation and scrolling, island focus and depth, hover text, character responses, touch and keyboard entry, reduced motion, theme persistence and responsive geometry. Restore or migrate the historical checks if their associated components become public again.
