import { $, Glob } from "bun";

const glob = new Glob("*.css");
const ROOT = "./node_modules/@radix-ui/colors/";

for await (const file of glob.scan(".")) {
  // clear existing
  await $`rm ${file}`;
}

// Scans the current working directory and each of its sub-directories recursively
for await (const file of glob.scan(ROOT)) {
  if (file.endsWith("-alpha.css")) continue;

  const text = await Bun.file(ROOT + file).text();
  const allLines = text.split("\n");
  const lastRelevantLine = allLines.findIndex((line) => line === "}");

  const lines = allLines.slice(0, lastRelevantLine + 1);

  const out = lines.map((line, idx, arr) => {
    // first line is ".dark, .dark-theme {"
    if (idx === 0) return line;
    // last line is "}"
    if (idx === arr.length - 1) return line;
    return processLine(line);
  });

  // join both light and dark colors into one file
  const outPath = `./${file.replace("-dark", "")}`;
  const existing = (await Bun.file(outPath).exists())
    ? (await Bun.file(outPath).text()).split("\n")
    : [];
  Bun.write(outPath, out.concat(existing).join("\n"));
}

function hexToHSL(hex: string): string {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }

  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  if (delta === 0) {
    h = 0;
  } else if (cmax === r) {
    h = ((g - b) / delta) % 6;
  } else if (cmax === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) {
    h += 360;
  }

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `${h}deg ${s}% ${l}%`;
}

function processLine(line: string) {
  const [, , variableName, color] = line.split(" ");
  const cleanColor = color.replace(";", "");
  return `  ${variableName} ${hexToHSL(cleanColor)};`;
}
