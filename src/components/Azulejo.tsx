import { useId } from 'react';
import { View } from 'react-native';
import Svg, { Defs, Pattern, Rect, Path, Circle } from 'react-native-svg';
import type { Category } from '@/domain';
import { restaurantTile, type TileMotif } from '@/theme/tiles';

// SVG rendering for the generative azulejo tiles (logic in src/theme/tiles.ts).
// TileThumb = square card/row thumbnail; TileHero = full-width detail band.

const CELL = 24; // motif repeat cell, in SVG user units

function Motif({ motif, color }: { motif: TileMotif; color: string }) {
  // One motif cell, drawn in `color`. Kept simple + tonal, like real azulejos.
  if (motif === 'quatrefoil') {
    const r = 5;
    const c = CELL / 2;
    return (
      <>
        <Circle cx={c} cy={c - 5} r={r} fill={color} opacity={0.9} />
        <Circle cx={c} cy={c + 5} r={r} fill={color} opacity={0.9} />
        <Circle cx={c - 5} cy={c} r={r} fill={color} opacity={0.9} />
        <Circle cx={c + 5} cy={c} r={r} fill={color} opacity={0.9} />
        <Circle cx={c} cy={c} r={2.5} fill={color} />
      </>
    );
  }
  if (motif === 'star') {
    // 8-point star = square + 45°-rotated square.
    return (
      <>
        <Path d="M12 3 L21 12 L12 21 L3 12 Z" fill={color} opacity={0.9} />
        <Path d="M12 6 L18 12 L12 18 L6 12 Z" fill={color} opacity={0.5} />
        <Rect x={9} y={9} width={6} height={6} fill={color} />
      </>
    );
  }
  // wave — azulejo scalloped border repeated.
  return (
    <Path
      d="M0 12 Q6 4 12 12 T24 12 M0 20 Q6 12 12 20 T24 20"
      stroke={color}
      strokeWidth={2.5}
      fill="none"
      opacity={0.85}
    />
  );
}

function TileSvg({
  motif,
  tint,
  bg,
  width,
  height,
}: {
  motif: TileMotif;
  tint: string;
  bg: string;
  width: number;
  height: number;
}) {
  const pid = useId(); // unique per instance so patterns never collide on web
  return (
    <Svg width={width} height={height}>
      <Defs>
        <Pattern id={pid} patternUnits="userSpaceOnUse" width={CELL} height={CELL}>
          <Motif motif={motif} color={tint} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill={bg} />
      <Rect width="100%" height="100%" fill={`url(#${pid})`} />
    </Svg>
  );
}

export function TileThumb({
  id,
  category,
  size = 48,
  tint,
  bg,
}: {
  id: string;
  category: Category;
  size?: number;
  tint?: string;
  bg?: string;
}) {
  const t = restaurantTile(id, category);
  return (
    <View
      style={{ width: size, height: size, borderRadius: 10, overflow: 'hidden' }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <TileSvg motif={t.motif} tint={tint ?? t.tint} bg={bg ?? t.bg} width={size} height={size} />
    </View>
  );
}

export function TileHero({
  id,
  category,
  height = 140,
  tint,
  bg,
}: {
  id: string;
  category: Category;
  height?: number;
  tint?: string;
  bg?: string;
}) {
  const t = restaurantTile(id, category);
  return (
    <View
      style={{ width: '100%', height, overflow: 'hidden' }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <TileSvg motif={t.motif} tint={tint ?? t.tint} bg={bg ?? t.bg} width={2000} height={height} />
    </View>
  );
}
