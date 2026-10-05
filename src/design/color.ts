// OKLCH → sRGB для страницы /design: HEX для Figma и контраст по WCAG 2.1.

type RGB = [number, number, number];

function parseOklch(v: string): [number, number, number] {
  const m = v.match(/oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!m) throw new Error(`Не OKLCH: ${v}`);
  return [Number(m[1]) / 100, Number(m[2]), Number(m[3])];
}

/** Линейный sRGB, обрезанный в [0, 1]. */
function toLinearRgb(v: string): RGB {
  const [L, C, h] = parseOklch(v);
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb: RGB = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return rgb.map((c) => Math.min(1, Math.max(0, c))) as RGB;
}

export function toHex(v: string) {
  return (
    "#" +
    toLinearRgb(v)
      .map((c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055))
      .map((c) => Math.round(c * 255).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function luminance(v: string) {
  const [r, g, b] = toLinearRgb(v);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(fg: string, bg: string) {
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function grade(ratio: number) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA крупный";
  return "мало";
}
