import type { Plugin } from "vite";
import pkg from "../package.json";
import {
  StyleImport,
  applyStyleNameTransformer,
  findStyleImports,
  formatVariableForStyleImports,
  importStyleNameTransformer,
} from "./handle-style-name";

interface Options {
  reactVariableName?: string;
}

const KEEP_STATEMENT = `console.log(TransformStyleNameCreateElement)`;

export default (options: Options = {}) => {
  const { reactVariableName = "React" } = options;
  const styleImportsMap = new Map<string, StyleImport[]>();

  const ReactInlineCssModuleImport = (): Plugin => {
    return {
      name: `${pkg.name}:pre`,
      enforce: "pre",
      async transform(code, id, options) {
        if (!/\.(tsx|jsx)$/.test(id)) return;
        const imports = findStyleImports(code);
        styleImportsMap.set(id, imports);
        if (!imports.length) return;
        const transformedCode = await importStyleNameTransformer(code, true);
        return {
          code: transformedCode + "\n;\n" + KEEP_STATEMENT + ";\n",
          map: null,
        };
      },
    };
  };

  const ReactInlineCssModuleTransform = (): Plugin => {
    return {
      name: `${pkg.name}:post`,
      enforce: "post",
      transform(code, id, options) {
        if (!/\.(tsx|jsx)$/.test(id)) return;
        const imports = styleImportsMap.get(id);
        styleImportsMap.delete(id);
        if (!imports || !imports.length) return;

        const formatted = formatVariableForStyleImports(code, imports);
        const classVariables = formatted.variables;

        let transformedCode = formatted.source;
        transformedCode = applyStyleNameTransformer(
          transformedCode,
          classVariables,
          reactVariableName
        );
        transformedCode = transformedCode.replace(KEEP_STATEMENT, "");

        return {
          code: transformedCode,
          map: null,
        };
      },
    };
  };

  return [ReactInlineCssModuleImport(), ReactInlineCssModuleTransform()];
};
