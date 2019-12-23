This is a bug report for webpack HMR. (Repro is for `4.41.1` but happens in `5.0.0-beta.10` as well)

## Summary

Two levels of wildcard re-export (`export * from '...'`) between modules plus an extra export in the middle module causes the final module to always be invalidated on the first HMR update even when it never changed.

With the following dependency graph:

``` js
// deps/a.js
export * from './b'

// deps/b.js
export * from './c'
export function b() {} // <-- this extra export is needed to reproduce

// deps/c.js
export function c() {}
```

And in `index.js`:

``` js
import { c } from './deps/a'

// other parts of the codebase, unrelated to deps
import { hot } from './hot'
hot()
module.hot.accept('./hot', () => {
  hot()
})
```

After starting WDS and edit `./hot.js`, the first HMR update always includes `./deps/a` (although it never changed), and causes the page to do a full reload. However, after the first HMR-caused page reload, HRM starts to function properly. This only happens at the fresh start of the server.
