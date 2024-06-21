const y = "@banshan-alec/vite-plugin-react-stylename", d = "1.0.0", _ = "Auto transform CSS Module class name for React with Vite.", g = "module", v = [
  "dist",
  "types"
], h = "./dist/vite-plugin-react-stylename.cjs", b = "./dist/vite-plugin-react-stylename.js", N = {
  test: 'echo "Normal: no test specified" && exit 0',
  build: "tsc && vite build",
  pub: "npm publish --access=public",
  ci: "npm run build && npm run test"
}, x = "", S = "MIT", C = [
  "vite",
  "plugin",
  "stylename"
], E = {
  registry: "https://npm.pkg.github.com/@banshan-alec"
}, T = {
  type: "git",
  url: "git+https://github.com/BanShan-Alec/react-inline-css-module.git"
}, j = {
  vite: "^5.0.0"
}, $ = {
  "@types/node": "^20.12.10",
  typescript: "^5.4.5",
  vite: "^5.2.11",
  "vite-plugin-dts": "^3.9.1"
}, p = {
  name: y,
  version: d,
  description: _,
  type: g,
  files: v,
  main: h,
  module: b,
  scripts: N,
  author: x,
  license: S,
  keywords: C,
  publishConfig: E,
  repository: T,
  peerDependencies: j,
  devDependencies: $
};
function w(r) {
  const t = /(^|\n)\s*import(?:\s+(.+?)\s+from)?\s+(?:'|")(.+?\.module\.(?:css|less|sass|scss))(?:'|");?/g;
  return [...r.matchAll(t)].map(
    ([e, s, l, n]) => ({
      statement: e,
      prefixStatement: s,
      variable: l,
      filepath: n
    })
  );
}
function A(r, t) {
  for (const e of t)
    if (!e.variable) {
      const s = M();
      e.variable = s, r = r.replace(
        e.statement,
        `${e.prefixStatement}import ${s} from '${e.filepath}';`
      );
    }
  return {
    variables: t.map((e) => e.variable),
    source: r
  };
}
let I = 1;
function M() {
  return `__cls_${I++}`;
}
const V = `"use strict";
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
async function k(r, t = !1) {
  return `var TransformStyleNameCreateElement = (function() {
    var exports = {};
    ${V};
    return exports.default;
  })();` + `
` + r;
}
function R(r, t, e) {
  return r = r.replace(
    // 另两种包裹函数名的由来见：https://www.typescriptlang.org/docs/handbook/jsx.html
    new RegExp(
      `(${e}\\.createElement|_?jsx|_?jsxs|_?jsxDEV)\\(`,
      "g"
    ),
    // TODO 为什么TransformStyleNameCreateElement要提前声明，不能在这里直接用注入呢
    `TransformStyleNameCreateElement($1, [${t.join(",")}], `
  ), console.log("[applyStyleNameTransformer] source: ", r), r;
}
const m = "console.log(TransformStyleNameCreateElement)", D = (r = {}) => {
  const { reactVariableName: t = "React" } = r, e = /* @__PURE__ */ new Map(), s = () => ({
    name: `${p.name}:pre`,
    enforce: "pre",
    async transform(n, a, u) {
      if (!/\.(tsx|jsx)$/.test(a)) return;
      const o = w(n);
      return e.set(a, o), o.length ? {
        code: await k(n, !0) + `
;
` + m + `;
`,
        map: null
      } : void 0;
    }
  }), l = () => ({
    name: `${p.name}:post`,
    enforce: "post",
    transform(n, a, u) {
      if (!/\.(tsx|jsx)$/.test(a)) return;
      const o = e.get(a);
      if (e.delete(a), !o || !o.length) return;
      const c = A(n, o), f = c.variables;
      let i = c.source;
      return i = R(
        i,
        f,
        t
      ), i = i.replace(m, ""), {
        code: i,
        map: null
      };
    }
  });
  return [s(), l()];
};
export {
  D as default
};
