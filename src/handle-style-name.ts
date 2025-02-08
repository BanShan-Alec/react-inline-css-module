import MagicString from "magic-string";
import { name as pkgName } from "../package.json";

/**
 * 找出代码中引入的样式文件
 */
export interface StyleImport {
  /** 引入了样式文件的语句 */
  statement: string;
  /** 引入语句前面的修饰符（空格、换行符等） */
  prefixStatement: string;
  /** 引入模块时指定的变量名 */
  variable?: string;
  /** 引入的文件路径 */
  filepath: string;
}

// 第零步：找到所有的样式导入
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

export function handleStyleName(
  source: string,
  imports: StyleImport[],
  reactVariableName: string
) {
  const stringEditor = new MagicString(source);
  const variables: string[] = [];

  /**
   * 第一步：处理样式导入, 给没指定变量名的样式引入补充上变量名
   *
   * 例子：`import './index.module.css';` => `import __cls_1 from './index.module.css';`
   */
  for (const info of imports) {
    if (!info.variable) {
      const variable = makeVariableName();
      info.variable = variable;
      variables.push(variable);

      const start = source.indexOf(info.statement);
      const end = start + info.statement.length;
      stringEditor.overwrite(
        start,
        end,
        `${info.prefixStatement}import ${variable} from '${info.filepath}';`
      );
    } else {
      variables.push(info.variable);
    }
  }

  // 第二步：添加 TransformStyleNameCreateElement 导入
  stringEditor.prepend(
    `import { TransformStyleNameCreateElement } from '${pkgName}';\n`
  );

  /**
   * 第三步：用 TransformStyleNameCreateElement 包裹原 React.createElement() 调用
   *
   * 例子：`React.createElement('div', { styleName: 'a' })` => `TransformStyleNameCreateElement(React.createElement, [__cls_1], 'div', { styleName: 'a' })`
   *
   * `createElement|_?jsx|_?jsxs|_?jsxDEV`为什么这样匹配的由来：https://www.typescriptlang.org/docs/handbook/jsx.html
   */
  const pattern = new RegExp(
    `(${reactVariableName}\\.createElement|_?jsx|_?jsxs|_?jsxDEV)\\(`,
    "g"
  );

  let match;
  while ((match = pattern.exec(source)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    stringEditor.overwrite(
      start,
      end,
      `TransformStyleNameCreateElement(${match[1]}, [${variables.join(",")}], `
    );
  }

  return stringEditor;
}

function makeVariableName() {
  return `__cls_${Math.random().toString().slice(-4)}`;
}
