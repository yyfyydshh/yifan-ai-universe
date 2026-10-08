# Production deployment

- Public site: https://yangyifan.me/
- Source repository: https://github.com/yyfyydshh/yifan-ai-universe
- Source branch: `main`
- GitHub Pages publication branch: `gh-pages`, root directory, custom domain from `public/CNAME`.

Validate the source with `SITE_URL=https://yangyifan.me pnpm verify:publish` and `pnpm exec playwright test`. The current homepage release suites use ArchipelagoHome; see `tests/e2e/legacy-home-tests.md` for the retained checks of retired homepage components.

Build the publication with `GITHUB_PAGES=true SITE_URL=https://yangyifan.me pnpm build`. Leave `BASE_PATH` and `NEXT_PUBLIC_BASE_PATH` empty for this custom domain. Deploy the contents of `out/` to the existing `gh-pages` branch, preserve `CNAME`, and include `.nojekyll`. Publication commits must descend from the current remote `gh-pages` head; do not force push.

Verify GitHub Pages reports a successful build of the publication commit, then verify the public `release.json` source SHA and load the homepage and project interactions from the live domain. Source push alone does not publish this branch-based site.
