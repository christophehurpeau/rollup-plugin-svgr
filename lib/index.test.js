'use strict';

const { rollup } = require('rollup');
const svgr = require('.');

const compile = (plugins = [svgr()]) =>
  rollup({
    input: './lib/__fixtures__/dino.svg',
    plugins,
  });

const getCode = (bundler) =>
  bundler.cache?.modules?.find(
    ({ id }) =>
      id.includes('__fixtures__/dino.svg') ||
      id.includes('__fixtures__\\dino.svg'),
  )?.code;

describe('rollup loader', () => {
  it('should convert file without babel', async () => {
    const code = await compile([svgr({})]);
    expect(getCode(code)).toMatchSnapshot();
  });
  it('should convert file without babel, native: true', async () => {
    const code = await compile([svgr({ native: true })]);
    expect(getCode(code)).toMatchSnapshot();
  });
  it('should convert file without babel, exportType: "named"', async () => {
    const code = await compile([svgr({ exportType: 'named' })]);
    expect(getCode(code)).toMatchSnapshot();
  });
  it('should convert file with babel', async () => {
    const code = await compile([
      svgr({
        babel: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      }),
    ]);
    expect(getCode(code)).toMatchSnapshot();
  });
});
