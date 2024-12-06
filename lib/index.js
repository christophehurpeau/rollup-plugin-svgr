import { createFilter } from "@rollup/pluginutils";
import { transform } from "@svgr/core";
import jsx from "@svgr/plugin-jsx";

export default function createSvgrRollupPlugin(options = {}) {
  const filter = createFilter(options.include || "**/*.svg", options.exclude);

  if (options.babel) {
    throw new Error(
      "options.babel is no longer supported in rollup-plugin-svgr. You can use options.transform instead.",
    );
  }

  if (options.transform && typeof options.transform !== "function") {
    throw new Error(
      "options.transform must be a function in rollup-plugin-svgr.",
    );
  }
  const additionalTransform = options.transform;
  const svgrOptions = { ...options };
  delete svgrOptions.transform;
  delete svgrOptions.include;
  delete svgrOptions.exclude;

  return {
    name: "svgr",
    async transform(data, id) {
      if (!id.endsWith(".svg")) return null;
      if (!filter(id)) return null;

      const jsCode = await transform(data, svgrOptions, {
        filePath: id,
        caller: {
          name: "rollup-plugin-svgr",
          previousExport: null,
          defaultPlugins: [jsx],
        },
      });

      if (!additionalTransform) {
        return {
          ast: {
            type: "Program",
            sourceType: "module",
            body: [],
          },
          code: jsCode,
          map: null,
        };
      }

      const transformedCode = await additionalTransform(jsCode, id);
      if (typeof transformedCode !== "string") {
        throw new TypeError(
          "options.transform must return a string in rollup-plugin-svgr. Maybe you forgot to return the transformed code?",
        );
      }
      return {
        code: transformedCode,
        map: null,
      };
    },
  };
}
