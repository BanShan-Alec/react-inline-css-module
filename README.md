# @banshan-alec/vite-plugin-react-stylename

>> fork from `https://github.com/anjianshi/react-inline-css-module`
Auto transform CSS Module class name for React with Webpack or Vite.

Like [babel-plugin-react-css-modules](https://github.com/gajus/babel-plugin-react-css-modules), but more easy to use.

1. Support Webpack and Vite
2. Support import multiple style files


## Vite Configuration

```javascript
import reactStylename from '@banshan-alec/vite-plugin-react-stylename';

module.exports = {
  ...
  plugins: [
    reactStylename({ reactVariableName: 'React' }) // options are optional
  ]
  ...
}
```

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "types": ["@banshan-alec/vite-plugin-react-stylename/types/style-name"]
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
