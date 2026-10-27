import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { cn } from '@/utils/cn';

// SafeAreaView + themed base background + horizontal padding. Removes the
// repeated screen boilerplate (DESIGN_PLAN §4).
export function ScreenContainer({
  children,
  edges = ['top'],
  padded = true,
  className,
}: {
  children: ReactNode;
  edges?: Edge[];
  padded?: boolean;
  className?: string;
}) {
  return (
    <SafeAreaView edges={edges} className="flex-1 bg-base dark:bg-base-dark">
      <View className={cn('flex-1', padded && 'px-4', className)}>{children}</View>
    </SafeAreaView>
  );
}
