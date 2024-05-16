# HSL Radix Colors

This repo contains CSS files with _Radix Colors_ converted to _hsl_ to support
[setting opacity in tailwind](https://tailwindcss.com/docs/customizing-colors#using-css-variables)
like so:

```html
<div class="bg-primary/30">
  <h1>Hello world</h1>
</div>
```

Helpful when using [shadcn/ui](https://ui.shadcn.com/) as they usually style
components with opacity.

To get a list of [all colors](https://www.radix-ui.com/colors) visit the
official Radix Colors website.

## Install

```sh
bun add hsl-radix-colors
```

## Usage example

### Add colors to _tailwind_

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

function color(cssVar: string) {
  return `hsl(var(--${cssVar}))`;
}

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: color("crimson-11"),
          foreground: color("crimson-1"),
        },
        secondary: {
          DEFAULT: color("blue-11"),
          foreground: color("blue-1"),
        },
      },
    },
  },
} satisfies Config;
```

### Import css files in your _global.css_

```css
/* global.css */
@import "hsl-radix-colors/crimson.css"; /* both light and dark included */
@import "hsl-radix-colors/blue.css"; /* both light and dark included */

@tailwind base;
@tailwind components;
@tailwind utilities;
```
