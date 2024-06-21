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
      fileName: 'vite-plugin-react-stylename'
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vite'],
    }
  },
  plugins: [dts({ rollupTypes: true })]
})

// TODO 单元测试
// 1. 只使用styleName
// 2. 使用styleName和className
// 3. 引入多个匿名的style
// 4. 引入具名的style的同时引入匿名的style
// 5. 引入匿名的style，但styleName是undefined