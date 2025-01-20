# vite-react-css-modules

Auto transform css-modules's className for React with Vite.


You can use [babel-plugin-react-css-modules](https://www.npmjs.com/package/babel-plugin-react-css-modules) to achieve the same effect.

But `vite` does not use Babel by default. This plugin provide a hack way to use styleName in vite.

## Feature

Fork from [anjianshi/react-inline-css-module](https://github.com/anjianshi/react-inline-css-module), but fix some errors.

1. Only support vite
2. Support import multiple css modules files
3. Fix vite plugin type error
4. Fix `styleName` order always after `className`.（Now follow your order which you set props）
5. Add some warnings when use. Like: `variable[${styleName}] is not defined!`
6. Remove unnecessary code, only trabsform code when `enforce: "post"` 
> [react-inline-css-module/src/index.ts at feature/vite-plugin · BanShan-Alec/react-inline-css-module](https://github.com/BanShan-Alec/react-inline-css-module/blob/feature/vite-plugin/src/index.ts)


## Vite Configuration

```javascript
// vite.config.js
import reactStylename from 'vite-react-css-modules';

module.exports = {
  ...
  plugins: [
    reactStylename()
  ]
  ...
}
```

## TypeScript Configuration
> Two way to configure ts prompt

global.d.ts（Recommended）
```ts
/// <reference types="vite/client" />
/// <reference types="vite-react-css-modules/types/style-name" />
...
```

tsconfig.json
```json
{
  "compilerOptions": {
    "types": ["vite-react-css-modules/types/style-name"]
  }
}
```

## Code Example
> Also work-well with `less`
### style.module.css

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
import './style.module.css'

function App() {
  return (
    <div styleName="app">
      <div>content</div>
      <div styleName="info">info</div>
    </div>
  )
}
```
