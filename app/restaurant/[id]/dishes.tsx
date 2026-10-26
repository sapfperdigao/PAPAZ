import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useDishes } from '@/hooks/useRestaurant';
import { getDb } from '@/db/client';
import { addDish, deleteDish } from '@/db/repo';
import { queryClient } from '@/query/client';

export default function DishesTab() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = String(params.id);
  const { data: dishes = [] } = useDishes(id);
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
    <ScrollView className="flex-1 bg-neutral-50 px-4 py-3 dark:bg-neutral-950">
      {dishes.map((d) => (
        <View
          key={d.id}
          className="mb-2 flex-row items-center justify-between rounded-xl bg-white p-3 dark:bg-neutral-900"
        >
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="font-semibold text-neutral-900 dark:text-neutral-50">{d.name}</Text>
              {d.source ? (
                <Text className="rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                  {d.source}
                </Text>
              ) : null}
            </View>
            {d.description ? (
              <Text className="mt-0.5 text-xs text-neutral-500">{d.description}</Text>
            ) : null}
          </View>
          <Pressable
            onPress={() => {
              deleteDish(getDb(), d.id);
              refresh();
            }}
          >
            <Text className="text-red-500">Delete</Text>
          </Pressable>
        </View>
      ))}

      {dishes.length === 0 ? (
        <Text className="mb-3 text-neutral-500">No dishes yet.</Text>
      ) : null}

      <View className="mt-3 rounded-xl bg-white p-3 dark:bg-neutral-900">
        <Text className="mb-2 text-xs font-semibold text-neutral-500">Add a dish</Text>
        <TextInput
          placeholder="Dish name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#9A9A9A"
          className="rounded-lg bg-neutral-100 px-3 py-2 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
        />
        <TextInput
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="#9A9A9A"
          className="mt-2 rounded-lg bg-neutral-100 px-3 py-2 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
        />
        <Pressable onPress={add} className="mt-2 items-center rounded-lg bg-amber-500 py-2">
          <Text className="font-semibold text-black">Add dish</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
