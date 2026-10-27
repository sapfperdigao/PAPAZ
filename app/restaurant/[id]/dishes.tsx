import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useDishes } from '@/hooks/useRestaurant';
import { getDb } from '@/db/client';
import { addDish, deleteDish } from '@/db/repo';
import { queryClient } from '@/query/client';
import { Button, Badge, EmptyState } from '@/components/ui';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function DishesTab() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = String(params.id);
  const { data: dishes = [] } = useDishes(id);
  const c = useThemeColors();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['dishes', id] });

  const add = () => {
    if (!name.trim()) return;
    addDish(getDb(), id, {
      name: name.trim(),
      description: description.trim() || undefined,
      source: 'personal',
      must_try: true,
    });
    setName('');
    setDescription('');
    refresh();
  };

  return (
    <ScrollView className="flex-1 bg-base px-4 py-3 dark:bg-base-dark">
      {dishes.map((d) => (
        <View
          key={d.id}
          className="mb-2 flex-row items-center justify-between rounded-card border border-black/5 bg-surface p-3 dark:border-white/10 dark:bg-surface-dark"
        >
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="font-serif-semibold text-ink dark:text-ink-dark">{d.name}</Text>
              {d.source ? <Badge label={d.source} /> : null}
            </View>
            {d.description ? (
              <Text className="mt-0.5 font-sans text-xs text-muted dark:text-muted-dark">
                {d.description}
              </Text>
            ) : null}
          </View>
          <Pressable
            onPress={() => {
              deleteDish(getDb(), d.id);
              refresh();
            }}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${d.name}`}
            hitSlop={8}
          >
            <Text className="font-sans-semibold text-sm text-danger dark:text-danger-dark">
              Delete
            </Text>
          </Pressable>
        </View>
      ))}

      {dishes.length === 0 ? (
        <EmptyState icon="fast-food-outline" title="No dishes yet" body="Add must-try dishes below." />
      ) : null}

      <View className="mt-3 rounded-card border border-black/5 bg-surface p-3 dark:border-white/10 dark:bg-surface-dark">
        <Text className="mb-2 font-sans-semibold text-xs text-muted dark:text-muted-dark">
          Add a dish
        </Text>
        <TextInput
          placeholder="Dish name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={c.muted}
          className="rounded-button bg-black/5 px-3 py-2 font-sans text-ink dark:bg-white/10 dark:text-ink-dark"
        />
        <TextInput
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={c.muted}
          className="mt-2 rounded-button bg-black/5 px-3 py-2 font-sans text-ink dark:bg-white/10 dark:text-ink-dark"
        />
        <View className="mt-2">
          <Button label="Add dish" onPress={add} />
        </View>
      </View>
    </ScrollView>
  );
}
