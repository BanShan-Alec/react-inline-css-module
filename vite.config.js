// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  // https://cn.vitejs.dev/config/build-options.html#build-lib
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vite'],
    }
  },
  plugins: [dts({ rollupTypes: true })]
})

// 发布到 github npm
// https://docs.github.com/en/packages/quickstart
// https://docs.github.com/zh/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
// https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
// https://github.com/settings/personal-access-tokens/new