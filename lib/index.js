import fs from "node:fs";
import { loadPartialConfig, transformAsync } from "@babel/core";
import { createFilter } from "@rollup/pluginutils";
import { transform } from "@svgr/core";
import jsx from "@svgr/plugin-jsx";

export default function createSvgrRollupPlugin(options = {}) {
  const filter = createFilter(options.include || "**/*.svg", options.exclude);
  const babelConfig = options.babel
    ? loadPartialConfig({
        babelrc: false,
        configFile: false,
        ...options.babel,
      })
    : undefined;

  return {
    name: "svgr",
    async transform(data, id) {
      if (!id.endsWith(".svg")) return null;
      if (!filter(id)) return null;

      const load = fs.readFileSync(id, "utf8");

      const jsCode = await transform(load, options, {
        filePath: id,
        caller: {
          name: "rollup-plugin-svgr",
          previousExport: null,
          defaultPlugins: [jsx],
        },
      });

      if (options.babel) {
        const result = await transformAsync(jsCode, babelConfig.options);
        if (!result?.code) {
          throw new Error("Error while transforming using Babel");
        }
        return { code: result.code, map: null };
      }

      return {
        ast: {
          type: "Program",
          start: 0,
          end: 0,
          sourceType: "module",
          body: [],
        },
        code: jsCode,
        map: null,
      };
    },
  };
}
