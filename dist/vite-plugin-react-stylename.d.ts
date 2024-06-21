import { Plugin } from 'vite';

declare const _default: (options?: Options) => Plugin<any>[];
export default _default;

declare interface Options {
    reactVariableName?: string;
}

export { }
