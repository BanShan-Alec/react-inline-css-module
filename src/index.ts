import type { Plugin } from "vite";
import { name as pkgName } from "../package.json";
import {
  StyleImport,
  applyStyleNameTransformer,
  findStyleImports,
  formatVariableForStyleImports,
  importStyleNameTransformer,
} from "./handle-style-name";

import TransformStyleNameCreateElement from "./transform-style-name-create-element";

interface Options {
  reactVariableName?: string;
}

export default (options: Options = {}): Plugin => {
  const { reactVariableName = "React" } = options;

  return {
    name: pkgName,
    enforce: "post",
    transform(code, id, options) {
      if (!/\.(tsx|jsx)$/.test(id)) return;
      const imports = findStyleImports(code).filter((item) => !item.variable);
      //   console.log("[ReactInlineCssModuleTransform] imports: ", id, imports);

      if (!imports.length) return;

      const formatted = formatVariableForStyleImports(code, imports);
      const classVariables = formatted.variables;

      let transformedCode = formatted.source;
      transformedCode = applyStyleNameTransformer(
        transformedCode,
        classVariables,
        reactVariableName
      );
      transformedCode = importStyleNameTransformer(transformedCode);
      //   console.log(
      //     "[ReactInlineCssModuleTransform] formatted: ",
      //     id,
      //     classVariables,
      //     transformedCode
      //   );

      return {
        code: transformedCode,
        map: null,
      };
    },
    config() {
      return {
        optimizeDeps: {
          // https://github.com/sveltejs/kit/issues/11793
          include: [pkgName],
        },
      };
    },
  };
};

export { TransformStyleNameCreateElement };
