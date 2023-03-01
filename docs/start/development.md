---
title: API Development Strategy
---

# API Development Strategy

TODO: Short-form version of https://remixdotrunstage.fly.dev/blog/future-flags

Draft Notes:

- New features are introduced with `unstable_feature` flags
  - Allows us to iterate on the API with early adopters as if we're in `v0.x.x` versions, but for a specific feature. The avoids churning the API for all users and arriving at better APIs in the final release.
  - Sets clear expectations with early adopters that it can break with no upgrade path while `unstable_*`.
- Breaking changes are introduced with `v[n+1]_*` future flags in the current version
  - i.e. if we are on `v2` then a breaking future flag would be `v3_somethingCool`
  - Both versions work in parallel, the current `v2` behavior as well as the new `v3_somethingCool` behavior
  - Allows apps update one change at a time, instead of everything all at once, long before the major version release
  - Major releases simply remove all the `v3_*` flags and `v2` code paths
