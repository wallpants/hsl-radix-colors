# Radix Colors

This repo contains CSS files with [radix colors](https://www.radix-ui.com/colors)
converted to hsl to support setting opacity in tailwind.

## Install

```sh
bun add @wallpants/radix-colors
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
      },
    },
  },
} satisfies Config;
```

### Import css files in your _global.css_

```css
/* global.css */
import "@wallpants/radix-colors/crimson.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```
