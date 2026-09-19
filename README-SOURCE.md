# Where this came from

This package is the published `parserail-api` SDK, renamed from the scoped package the
studio shipped under its old name. It was recovered from the npm tarball on 2026-09-19
because no source repository for it exists any more: the monorepo that built it was
purged on 2026-09-14, there is no `apps/` directory in the parserail repo, and no
GitHub repository carries it.

So `dist/` here is the shipped artifact, not a build output. There is no TypeScript
source to compile. Anything changed here is changed in `dist/` directly and republished,
until the SDK is generated from ParseRail's own route definitions again.

`ParseRailCore` and `ParseRailError` are the exported names. The previous class names are
kept as aliases at the end of `dist/index.js` and `dist/index.d.ts`, so code importing
them keeps working.
