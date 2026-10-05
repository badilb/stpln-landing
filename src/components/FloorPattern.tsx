import type { ReactNode } from "react";
import type { PatternKind } from "@/data/catalog";

// Рисунки укладки строятся геометрией, а не картинками: так каждый раздел
// показан своей раскладкой, без стоковых фото.

type Props = {
  kind: PatternKind;
  width: number;
  height: number;
  /** "line" — контур тушью для списка; "wood" — заливка древесными тонами. */
  variant?: "line" | "wood";
  /** Длина планки в условных единицах (для ёлки). */
  plank?: number;
  className?: string;
  title?: string;
  /** Оттенки планок; по умолчанию — древесные тона пресета */
  palette?: string[];
  seam?: string;
  /** Сдвиг «шума», чтобы два товара одного тона не выглядели одинаково */
  seed?: number;
};

const WOOD = ["var(--wood-1)", "var(--wood-2)", "var(--wood-3)", "var(--wood-4)", "var(--wood-5)"];

// Детерминированный «шум», чтобы оттенки планок не прыгали между рендерами.
type Shade = (i: number, j: number) => string;

/** Одна цифра после запятой — на глаз не отличить, а HTML в разы легче */
const r1 = (n: number) => Math.round(n * 10) / 10;

function makeShade(palette: string[], seed: number): Shade {
  return (i, j) => {
    const n = Math.sin((i + seed * 3.17) * 12.9898 + (j + seed) * 78.233) * 43758.5453;
    return palette[Math.floor((n - Math.floor(n)) * palette.length)];
  };
}

type Rect = { x: number; y: number; w: number; h: number; fill: string };

/** Английская ёлка: планки под 90° друг к другу. Строим в осях, потом поворачиваем на 45°. */
function herringbone(w: number, h: number, L: number, W: number, shade: Shade): { rects: Rect[]; transform: string } {
  const rects: Rect[] = [];
  const reach = Math.hypot(w, h);
  const kMax = Math.ceil((reach * 2) / W);
  const mMax = Math.ceil(reach / L) + 2;
  for (let m = -mMax; m <= mMax; m++) {
    for (let k = -kMax; k <= kMax; k++) {
      const ox = k * W + m * L;
      const oy = k * W - m * L;
      // Отбрасываем планки за кадром: центр планки после поворота на 45° должен быть
      // в пределах картинки с запасом на длину планки — иначе страница весит мегабайты
      for (const r of [
        { x: ox, y: oy, w: L, h: W, fill: shade(k, m) },
        { x: ox, y: oy + W, w: W, h: L, fill: shade(k + 31, m) },
      ]) {
        const cx = r.x + r.w / 2;
        const cy = r.y + r.h / 2;
        const sx = (cx - cy) * Math.SQRT1_2;
        const sy = (cx + cy) * Math.SQRT1_2;
        if (Math.abs(sx) < w / 2 + L && Math.abs(sy) < h / 2 + L) rects.push(r);
      }
    }
  }
  return { rects, transform: `translate(${w / 2} ${h / 2}) rotate(45)` };
}

/** Французская ёлка: параллелограммы со скосом 45°, стык в одну линию. */
function chevron(w: number, h: number, col: number, step: number, shade: Shade) {
  const polys: { points: string; fill: string }[] = [];
  const cols = Math.ceil(w / col) + 1;
  const rows = Math.ceil((h + col * 2) / step) + 2;
  for (let c = 0; c < cols; c++) {
    const x0 = c * col;
    const up = c % 2 === 0;
    for (let r = -2; r < rows; r++) {
      const y = r * step;
      const pts = up
        ? [[x0, y + col], [x0 + col, y], [x0 + col, y + step], [x0, y + col + step]]
        : [[x0, y], [x0 + col, y + col], [x0 + col, y + col + step], [x0, y + step]];
      polys.push({ points: pts.map((p) => p.map(r1).join(",")).join(" "), fill: shade(c, r) });
    }
  }
  return polys;
}

/** Палуба: ряды досок со смещёнными стыками. */
function deck(w: number, h: number, row: number, len: number, shade: Shade): Rect[] {
  const rects: Rect[] = [];
  const offsets = [0, 0.45, 0.2, 0.7, 0.35, 0.85];
  for (let r = 0; r * row < h; r++) {
    const off = offsets[r % offsets.length] * len;
    for (let x = -off; x < w; x += len) {
      rects.push({ x, y: r * row, w: len, h: row, fill: shade(r, Math.round(x)) });
    }
  }
  return rects;
}

/** Геометрический: квадраты, в каждом планки, направление чередуется (шахматка). */
function geometric(w: number, h: number, cell: number, strips: number, shade: Shade): Rect[] {
  const rects: Rect[] = [];
  const s = cell / strips;
  for (let i = 0; i * cell < h; i++) {
    for (let j = 0; j * cell < w; j++) {
      const horizontal = (i + j) % 2 === 0;
      for (let k = 0; k < strips; k++) {
        rects.push(
          horizontal
            ? { x: j * cell, y: i * cell + k * s, w: cell, h: s, fill: shade(i * 7 + k, j) }
            : { x: j * cell + k * s, y: i * cell, w: s, h: cell, fill: shade(i, j * 7 + k) },
        );
      }
    }
  }
  return rects;
}

function Rects({ rects, line, seam }: { rects: Rect[]; line: boolean; seam: string }) {
  return (
    <>
      {rects.map((r, i) => (
        <rect
          key={i}
          x={r1(r.x)}
          y={r1(r.y)}
          width={r1(r.w)}
          height={r1(r.h)}
          fill={line ? "none" : r.fill}
          stroke={line ? "currentColor" : seam}
          strokeWidth={line ? 1 : 0.6}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </>
  );
}

export function FloorPattern({ kind, width, height, variant = "line", plank, className, title, palette, seam = "var(--wood-seam)", seed = 0 }: Props) {
  const line = variant === "line";
  const shade = makeShade(palette ?? WOOD, seed);
  const u = Math.min(width, height);
  let body: ReactNode = null;

  switch (kind) {
    case "herringbone": {
      const W = u / (line ? 5 : 9);
      const { rects, transform } = herringbone(width, height, plank ?? W * 5, W, shade);
      body = (
        <g transform={transform}>
          <Rects rects={rects} line={line} seam={seam} />
        </g>
      );
      break;
    }
    case "chevron": {
      const col = u / (line ? 3 : 5);
      body = chevron(width, height, col, col * 0.42, shade).map((p, i) => (
        <polygon
          key={i}
          points={p.points}
          fill={line ? "none" : p.fill}
          stroke={line ? "currentColor" : seam}
          strokeWidth={line ? 1 : 0.6}
          vectorEffect="non-scaling-stroke"
        />
      ));
      break;
    }
    case "deck":
      body = <Rects rects={deck(width, height, line ? u / 4 : u / 9, line ? width * 0.55 : (u / 9) * 6.5, shade)} line={line} seam={seam} />;
      break;
    case "click":
      body = (
        <>
          <Rects rects={deck(width, height, u / 3, width * 0.6, shade)} line={line} seam={seam} />
          {/* профиль замка */}
          <path
            d={`M${width * 0.62} ${height - 4} h6 v-4 h4 v4 h6`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.4}
          />
        </>
      );
      break;
    case "glue":
      body = (
        <>
          <Rects rects={deck(width, height, u / 3, width * 0.6, shade)} line={line} seam={seam} />
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i} cx={6 + i * (width / 8)} cy={height - 3} r={1.4} fill="currentColor" />
          ))}
        </>
      );
      break;
    case "geometric":
      body = <Rects rects={geometric(width, height, u / (line ? 2 : 3), 4, shade)} line={line} seam={seam} />;
      break;
    case "modular": {
      const cell = u / (line ? 1.5 : 2.5);
      const items: ReactNode[] = [];
      for (let i = 0; i * cell < height; i++) {
        for (let j = 0; j * cell < width; j++) {
          const x = j * cell;
          const y = i * cell;
          const b = cell * 0.16;
          items.push(
            <g key={`${i}-${j}`} stroke="currentColor" strokeWidth={1} fill="none" vectorEffect="non-scaling-stroke">
              <rect x={x} y={y} width={cell} height={cell} />
              <rect x={x + b} y={y + b} width={cell - 2 * b} height={cell - 2 * b} />
              <path d={`M${x + b} ${y + b} L${x + cell - b} ${y + cell - b} M${x + cell - b} ${y + b} L${x + b} ${y + cell - b}`} />
            </g>,
          );
        }
      }
      body = items;
      break;
    }
    case "carpet": {
      // Ворс — одна плитка 4×3, повторённая <pattern>: раньше были сотни тысяч сегментов кривой
      const pid = `carpet-${width}-${height}-${seed}`;
      body = (
        <>
          <defs>
            <pattern id={pid} width={4} height={3} patternUnits="userSpaceOnUse">
              <path d="M0 1.5 q1 -1.5 2 0 t2 0" fill="none" stroke="currentColor" strokeWidth={0.7} />
            </pattern>
          </defs>
          <rect width={width} height={height} fill={`url(#${pid})`} />
        </>
      );
      break;
    }
    case "adhesive": {
      // След зубчатого шпателя
      const t = 6;
      body = [0.3, 0.55, 0.8].map((k, i) => (
        <path
          key={i}
          d={`M0 ${height * k} ${Array.from({ length: Math.ceil(width / t) }, () => `l${t / 2} -${t / 2} l${t / 2} ${t / 2}`).join(" ")}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
        />
      ));
      break;
    }
    case "underlay":
      body = (
        <>
          <rect x={0} y={height * 0.25} width={width} height={height * 0.18} fill="none" stroke="currentColor" />
          <rect x={0} y={height * 0.5} width={width} height={height * 0.1} fill="none" stroke="currentColor" />
          {Array.from({ length: Math.floor(width / 6) }, (_, i) => (
            <circle key={i} cx={3 + i * 6} cy={height * 0.75} r={1.6} fill="none" stroke="currentColor" strokeWidth={0.8} />
          ))}
        </>
      );
      break;
    case "skirting":
      // Сечение плинтуса у стены
      body = (
        <path
          d={`M${width * 0.25} 2 V${height - 6} H${width - 4} M${width * 0.25} 6 h8 v${height * 0.35} q0 6 6 8 v${height * 0.3} h-14`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
        />
      );
      break;
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      preserveAspectRatio="xMidYMid slice"
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <clipPath id={`clip-${kind}-${width}-${height}-${seed}`}>
          <rect width={width} height={height} />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${kind}-${width}-${height}-${seed})`}>{body}</g>
    </svg>
  );
}
