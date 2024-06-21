import { buildTransformFn } from "./buildTransformFn";

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

let nextId = 1;
function makeVariableName() {
  return `__cls_${nextId++}`;
}

/**
 * 将 styleName 转换函数引入代码
 *
 * inline:
 *  为 true 则将 TransformStyleNameCreateElement 的代码直接插入 source
 *  为 false 则用 import 的形式引入
 * (Vite 下用 inline 的形式性能更好)
 */
const bareSource = `"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
function TransformStyleNameCreateElement(origCreateElement, classVariables, name, rawProps) {
    var extra = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        extra[_i - 4] = arguments[_i];
    }
    var props = __assign({}, rawProps);
    // 此判断同时确定了 styleName 不为空，且类型是字符串（但有可能是空字符串）
    // styleName 是空字符串时也有必要走到 if 判断内部，因为需要删除 props 里的 styleName 属性（不然 React 会出现警告）
    if (typeof props.styleName === 'string') {
        props.className = props.styleName
            .split(' ')
            .reduce(function (classNames, styleName) { return (__spreadArray(__spreadArray([], __read(classNames), false), __read(classVariables.map(function (variable) { return variable[styleName]; })), false)); }, [props.className])
            .filter(function (v) { return v; })
            .join(' ');
        delete props.styleName;
    }
    return origCreateElement.apply(void 0, __spreadArray([name, props], __read(extra), false));
}
exports.default = TransformStyleNameCreateElement;
`;
export async function importStyleNameTransformer(
  source: string,
  inline = false
) {
  // const code = await buildTransformFn();
  // console.info("buildTransformFn Done!", code);

  const transformerSource = `var TransformStyleNameCreateElement = (function() {
    var exports = {};
    ${bareSource};
    return exports.default;
  })();`;
  return transformerSource + "\n" + source;
}

/**
 * 用 styleName 转换函数包裹原 React.createElement() 调用
 */
export function applyStyleNameTransformer(
  source: string,
  classVariables: string[],
  reactVariableName: string
) {
  source = source.replace(
    // 另两种包裹函数名的由来见：https://www.typescriptlang.org/docs/handbook/jsx.html
    new RegExp(
      `(${reactVariableName}\\.createElement|_?jsx|_?jsxs|_?jsxDEV)\\(`,
      "g"
    ),
    // TODO 为什么TransformStyleNameCreateElement要提前声明，不能在这里直接用注入呢
    `TransformStyleNameCreateElement($1, [${classVariables.join(",")}], `
  );
  // TODO 打印看看
  console.log("[applyStyleNameTransformer] source: ", source);

  return source;
}
