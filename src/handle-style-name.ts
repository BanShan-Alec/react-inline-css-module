import { name as pkgName } from "../package.json";

/**
 * 找出代码中引入的样式文件
 */
export interface StyleImport {
  statement: string; // 引入了样式文件的语句
  prefixStatement: string; // 引入语句前面的修饰符（空格、换行符等）
  variable?: string; // 引入模块时指定的变量名
  filepath: string; // 引入的文件路径
}
export function findStyleImports(source: string): StyleImport[] {
  const pattern =
    /(^|\n)\s*import(?:\s+(.+?)\s+from)?\s+(?:'|")(.+?\.module\.(?:css|less|sass|scss))(?:'|");?/g;
  return [...source.matchAll(pattern)].map(
    ([statement, prefixStatement, variable, filepath]) => ({
      statement,
      prefixStatement,
      variable,
      filepath,
    })
  );
}

/**
 * 给没指定变量名的样式引入补充上变量名
 *
 * 例子：`import './index.module.css';` => `import __cls_1 from './index.module.css';`
 */
export function formatVariableForStyleImports(
  source: string,
  imports: StyleImport[]
) {
  for (const info of imports) {
    if (!info.variable) {
      const variable = makeVariableName();
      info.variable = variable;
      source = source.replace(
        info.statement,
        `${info.prefixStatement}import ${variable} from '${info.filepath}';`
      );
    }
  }

  return {
    variables: imports.map((info) => info.variable) as string[],
    source,
  };
}

function makeVariableName() {
  return `__cls_${Math.random().toString().slice(-4)}`;
}

export function importStyleNameTransformer(source: string, inline = false) {
  const importCode = `import { TransformStyleNameCreateElement } from '${pkgName}'`;
  return importCode + "\n" + source;
}

/**
 * 用 styleName 转换函数包裹原 React.createElement() 调用
 *
 * 例子：`React.createElement('div', { styleName: 'a' })` => `TransformStyleNameCreateElement(React.createElement, [__cls_1], 'div', { styleName: 'a' })`
 */
export function applyStyleNameTransformer(
  source: string,
  classVariables: string[],
  reactVariableName: string
) {
  source = source.replace(
    // 为什么这样匹配的由来：https://www.typescriptlang.org/docs/handbook/jsx.html
    new RegExp(
      `(${reactVariableName}\\.createElement|_?jsx|_?jsxs|_?jsxDEV)\\(`,
      "g"
    ),
    `TransformStyleNameCreateElement($1, [${classVariables.join(",")}], `
  );

  return source;
}
