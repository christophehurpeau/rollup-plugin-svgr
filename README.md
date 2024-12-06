<h3 align="center">
  rollup-plugin-svgr
</h3>

<p align="center">
  simple rollup plugin svgr without svgo or babel
</p>

<p align="center">
  <a href="https://npmjs.org/package/rollup-plugin-svgr"><img src="https://img.shields.io/npm/v/rollup-plugin-svgr.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/rollup-plugin-svgr"><img src="https://img.shields.io/npm/dw/rollup-plugin-svgr.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/rollup-plugin-svgr"><img src="https://img.shields.io/node/v/rollup-plugin-svgr.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/rollup-plugin-svgr"><img src="https://img.shields.io/npm/types/rollup-plugin-svgr.svg?style=flat-square"></a>
</p>

## Install

```bash
npm install --save-dev rollup-plugin-svgr
```

## Alternatives

Official https://www.npmjs.com/package/@svgr/rollup which has svgo and babel enabled by default, unlike this library.

## Usage

```js
{
  plugins: [svgr()];
}
```

```js
{
  plugins: [svgr({ native: true })];
}
```

You can add a additional transform step. For example, babel: first, you need `@babel/core`, `@babel/preset-react` and `@babel/preset-env` installed, then pass `transform` option:

```js
import { loadPartialConfig, transformAsync } from "@babel/core";
const babelConfig = loadPartialConfig({
  babelrc: false,
  configFile: false,
  presets: ["@babel/preset-env", "@babel/preset-react"],
});

{
  plugins: [
    svgr({
      transform: async (code) => {
        const result = await transformAsync(code, babelConfig.options);
        if (!result?.code) {
          throw new Error("Error while transforming using Babel");
        }
        return result.code;
      },
    }),
  ];
}
```

## No svgo enabled

Svgo at runtime is costly, consider using a tool like [lint-staged-imagemin](https://www.npmjs.com/package/lint-staged-imagemin) instead, or simply run and commit svgo modified files.
