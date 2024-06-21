import { build } from "vite";
import { resolve } from "path";

let code = "";
export const buildTransformFn = async () => {
  if (code) return code;

  const chunk = await build({
    configFile: false,
    build: {
      emptyOutDir: false,
      lib: {
        name: "TransformStyleNameCreateElement",
        entry: resolve(__dirname, "transform-style-name-create-element.ts"),
        formats: ["iife"],
      },
      rollupOptions: {
        output: {
          dir: resolve(__dirname),
          entryFileNames: "transform-style-name-create-element.js",
        },
      },
    },
  });

  const output = chunk[0]?.output?.[0];
  code = output?.code as string;

  return code;
};
