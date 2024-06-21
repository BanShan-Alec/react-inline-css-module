interface StyleProps {
  className?: string;
  styleName?: string;
}

export default function TransformStyleNameCreateElement<
  Props extends StyleProps
>(
  origCreateElement: (name: string, props: any, ...extra: any[]) => any,
  classVariables: { [name: string]: string }[],
  name: string,
  rawProps: Props,
  ...extra: any[]
) {
  const props = { ...rawProps };
  const styleName = props.styleName;
  // 此判断同时确定了 styleName 不为空，且类型是字符串（但有可能是空字符串）
  // styleName 是空字符串时也有必要走到 if 判断内部，因为需要删除 props 里的 styleName 属性（不然 React 会出现警告）
  if (typeof styleName === "string") {
    const newClassName = styleName
      .split(" ")
      .reduce((classNamesArr, styleName) => {
        if (classVariables.every((variable) => !variable[styleName])) {
          console.warn(
            `%c [@banshan-alec/vite-plugin-react-stylename] variable[${styleName}] is not defined!`,
            "color: orange"
          );
          return classNamesArr;
        }
        return [
          ...classNamesArr,
          ...classVariables.map((variable) => variable[styleName]),
        ];
      }, [] as string[])
      .filter(Boolean)
      .join(" ");

    // 解决顺序问题，styleName 在 className 前面还是后面
    // 只适用于在ES6及更高版本的JavaScript中，因为在ES6之前的版本中，对象的属性顺序是不确定的
    const keys = Object.keys(props);
    if (keys.indexOf("className") < keys.indexOf("styleName")) {
      props.className = [newClassName, props.className]
        .filter(Boolean)
        .join(" ");
    } else {
      props.className = [props.className, newClassName]
        .filter(Boolean)
        .join(" ");
    }

    delete props.styleName;
  } else {
    if (typeof styleName === "undefined") return;
    console.warn(
      "%c [@banshan-alec/vite-plugin-react-stylename] styleName is not a string!",
      "color: red"
    );
  }
  return origCreateElement(name, props, ...extra);
}
