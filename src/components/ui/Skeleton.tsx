import { View } from 'react-native';
import { cn } from '@/utils/cn';

// Shimmer-ish placeholder block (DESIGN_PLAN §4). Static neutral fill — the
// loading state that prevents an empty-state flash on slow reads. A list of
// SkeletonCard rows matches the restaurant card shape.
export function Skeleton({ className }: { className?: string }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={cn('rounded-badge bg-black/10 dark:bg-white/10', className)}
    />
  );
}

export function SkeletonCard({ testID }: { testID?: string }) {
  return (
    <View
      testID={testID}
      className="mb-2 rounded-card border border-black/5 bg-surface p-3 dark:border-white/10 dark:bg-surface-dark"
    >
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="mt-2 h-3 w-1/4" />
      <View className="mt-3 flex-row gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-10" />
      </View>
    </View>
  );
}

export function SkeletonList({ count = 6 }: { count?: number }) {
  return (
    <View testID="skeleton-list">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}
