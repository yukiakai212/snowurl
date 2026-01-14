# snowurl

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

[![Build Status][github-build-url]][github-url]
[![codecov][codecov-image]][codecov-url]

# snowurl

> A strict, predictable URL builder for TypeScript.
> No magic. No ambiguity. No broken typings.

**snowurl** is a rule-based alternative to `urlcat`, designed to fix long-standing issues with ambiguous parameter resolution and unreliable TypeScript inference.

If you are tired of bugs caused by paths like `:id.html`, `:name-doc+x`, or mismatched runtime vs typing behavior — this library is for you.

---

## Features

* ✅ **Strict parameter grammar**: `[A-Za-z0-9_]+`
* ✅ Parameters stop at the **first invalid character**
* ✅ Extensions and suffixes are always **literal**
* ✅ Runtime behavior === TypeScript types
* ✅ Fail-fast with clear error messages
* ✅ Supports CJS & ESM
* ✅ Zero dependencies

---

## Installation

```bash
npm install snowurl
```

---

## Usage

```ts
import { url } from "snowurl";

url("/file/:hash.tar.gz", { hash: "abc" });
// => "/file/abc.tar.gz"

url("/:name-doc+x", { name: "snow" });
// => "/snow-doc+x"
```

---

## Core Rule (Very Important)

### Parameter grammar

```
:param
param := [A-Za-z0-9_]+
```

* A parameter **starts with `:`**
* Its name may contain **only** `a–z`, `0–9`, `_`
* The parameter **ends immediately** when an invalid character is encountered
* Everything after that is treated as **literal text**

There are **no options** to change this behavior.

---

### API

See docs: [API Docs][api-docs-url]

---

## Examples

### 1. Literal suffixes (extensions, formats, versions)

```ts
url("/download/:file.zip", { file: "data" });
// => "/download/data.zip"

url("/v/:id@latest", { id: 123 });
// => "/v/123@latest"
```

---

### 2. Mixed characters after parameters

```ts
url("/:name-doc+x", { name: "abc" });
// => "abc-doc+x"
```

Here:

* `name` is the parameter
* `-doc+x` is always literal

---

## Invalid Usage (Throws Errors)

### Invalid parameter name

```ts
url("/:name-doc", {
  "name-doc": "x"
});
```

**Error:**

```
Unknown param "name-doc".
Only parameters matching [A-Za-z0-9_] are allowed.
```

---

### Missing parameter

```ts
url("/user/:id", {});
```

**Error:**

```
Missing param "id"
```

---

### Extra / unknown parameter

```ts
url("/user/:id", { id: 1, foo: "bar" });
```

**Error:**

```
Unknown param "foo"
```

---

## Why snowurl instead of urlcat?

|                      | urlcat                  | snowurl                 |
| -------------------- | ----------------------- | ----------------------- |
| Parameter grammar    | Ambiguous               | Strict & explicit       |
| `:id.html`           | May resolve incorrectly | Always resolves `id`    |
| TypeScript inference | Often mismatched        | Matches runtime exactly |
| Fail-fast errors     | ❌                       | ✅                       |
| Predictability       | ❌                       | ✅                       |

> **snowurl does not guess your intent — it enforces correctness.**

---

## Design Philosophy

* Explicit > Magic
* Grammar > Heuristics
* Correctness > Flexibility
* Type safety is a **first-class concern**

If your path is:

```
/:file.tar.gz
```

Then the parameter is **always** `file`.
`file.tar.gz` is never considered a parameter name.

---

## TypeScript Support

`snowurl` infers parameter names at **compile time**:

```ts
url("/:user_id/profile", {
  user_id: 123,   // ✅
  // userId: 123  // ❌ TypeScript error
});
```

This prevents an entire class of runtime bugs before your code runs.

---

## When should you use snowurl?

* REST / HTTP clients
* SDKs
* Internal tooling
* Long-lived projects that value correctness
* When `urlcat` has caused subtle or painful bugs

---

## License

MIT © [Yuki Akai](https://github.com/yukiakai212)

---



[npm-downloads-image]: https://badgen.net/npm/dm/snowurl
[npm-downloads-url]: https://www.npmjs.com/package/snowurl
[npm-url]: https://www.npmjs.com/package/snowurl
[npm-version-image]: https://badgen.net/npm/v/snowurl
[github-build-url]: https://github.com/yukiakai212/snowurl/actions/workflows/build.yml/badge.svg
[github-url]: https://github.com/yukiakai212/snowurl/
[codecov-image]: https://codecov.io/gh/yukiakai212/snowurl/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/yukiakai212/snowurl
[changelog-url]: https://github.com/yukiakai212/snowurl/blob/main/CHANGELOG.md
[api-docs-url]: https://yukiakai212.github.io/snowurl/
