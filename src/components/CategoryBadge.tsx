import type { Category } from '@/domain';
import { Badge } from './ui';
import { tokens } from '@/theme/tokens';

const LABELS: Record<Category, string> = {
  tasca: 'Tasca',
  cervejaria: 'Cervejaria',
  marisqueira: 'Marisqueira',
  other: 'Other',
};

// Thin wrapper over the Badge primitive (DESIGN_PLAN §4): a solid fill in the
// category's own hue, with dark-ink text (all category colors clear AA that way).
export function CategoryBadge({ category }: { category: Category }) {
  return <Badge testID="category-badge" label={LABELS[category]} color={tokens.category[category]} />;
}
