# @banshan-alec/vite-plugin-react-stylename

Auto transform CSS Module class name for React with Vite.

Fork from [anjianshi/react-inline-css-module: Auto transform CSS Module class name for React with Webpack or Vite.](https://github.com/anjianshi/react-inline-css-module), but fix some errors.

1. Only support vite
2. Support import multiple style files
3. Fix vite plugin type error
4. Fix `styleName` order always after `className`.（Now follow your order which you set props）
5. Add some warnings when use. Like: `variable[${styleName}] is not defined!`
6. Eliminate unnecessary code, only trabsform code when `enforce: "post"` 
> [react-inline-css-module/src/index.ts at feature/vite-plugin · BanShan-Alec/react-inline-css-module](https://github.com/BanShan-Alec/react-inline-css-module/blob/feature/vite-plugin/src/index.ts)


## Vite Configuration

```javascript
import reactStylename from '@banshan-alec/vite-plugin-react-stylename';

module.exports = {
  ...
  plugins: [
    reactStylename()
  ]
  ...
}
```

## TypeScript Configuration
> Configure one of them

global.d.ts（Recommended）
```ts
/// <reference types="vite/client" />
/// <reference types="@banshan-alec/vite-plugin-react-stylename/types/style-name" />
...
```

tsconfig.json
```json
{
  "compilerOptions": {
    "types": ["react-inline-css-module/src/style-name"]
  }
}
```

## App Code Example

### app.module.css

```css
.app {
  color: #777;
}

.info {
  color: green;
}
```

### App.tsx

```js
import './app.module.css'

function App() {
  return (
    <div styleName="app">
      <div>content</div>
      <div styleName="info">info</div>
    </div>
  )
}
```
