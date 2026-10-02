# Where this came from

This package is the published `parserail-api` SDK, renamed from the scoped package the
studio shipped under its old name. It was recovered from the npm tarball on 2026-09-19
because no source repository for it exists any more: the monorepo that built it was
purged on 2026-09-14, there is no `apps/` directory in the parserail repo, and no
GitHub repository carries it.

So `dist/` here is the shipped artifact, not a build output. There is no TypeScript
source to compile. Anything changed here is changed in `dist/` directly and republished,
until the SDK is generated from ParseRail's own route definitions again.

`ParseRailCore` and `ParseRailError` are the exported names. Version 0.5.3 also exported the
previous class names as aliases. Commit 2226035 removed those aliases on 2026-09-29 with the
retired studio name, and 0.5.4 is the first published version without them.
