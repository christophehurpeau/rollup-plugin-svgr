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

By default, babel is not enabled. First, you probably need `@babel/core`, `@babel/preset-react` and `@babel/preset-env` installed, then pass `babel` option:

```js
{
  plugins: [
    svgr({
      babel: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
      },
    }),
  ];
}
```

## No svgo enabled

Svgo at runtime is costly, consider using a tool like [lint-staged-imagemin](https://www.npmjs.com/package/lint-staged-imagemin) instead, or simply run and commit svgo modified files.
