import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useWines } from '@/hooks/useRestaurant';
import { getDb } from '@/db/client';
import { addWine, deleteWine, groupWinesByType } from '@/db/repo';
import { queryClient } from '@/query/client';
import type { WineType } from '@/domain';

const TYPES: WineType[] = ['red', 'white', 'green', 'rosé', 'sparkling', 'natural', 'fortified'];

export default function WineTab() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = String(params.id);
  const { data: wines = [] } = useWines(id);
  const [name, setName] = useState('');
  const [type, setType] = useState<WineType>('red');
  const [region, setRegion] = useState('');

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['wines', id] });
  const grouped = groupWinesByType(wines);

  const add = () => {
    if (!name.trim()) return;
    addWine(getDb(), id, {
      name: name.trim(),
      wine_type: type,
      region: region.trim() || undefined,
    });
    setName('');
    setRegion('');
    refresh();
  };

  return (
    <ScrollView className="flex-1 bg-neutral-50 px-4 py-3 dark:bg-neutral-950">
      {Object.keys(grouped).length === 0 ? (
        <Text className="mb-3 text-neutral-500">No wines yet.</Text>
      ) : (
        Object.entries(grouped).map(([groupType, list]) => (
          <View key={groupType} className="mb-4">
            <Text className="mb-1 text-xs font-semibold uppercase text-neutral-500">{groupType}</Text>
            {list.map((w) => (
              <View
                key={w.id}
                className="mb-2 flex-row items-center justify-between rounded-xl bg-white p-3 dark:bg-neutral-900"
              >
                <View className="flex-1">
                  <Text className="font-semibold text-neutral-900 dark:text-neutral-50">{w.name}</Text>
                  {w.region || w.producer ? (
                    <Text className="mt-0.5 text-xs text-neutral-500">
                      {[w.producer, w.region].filter(Boolean).join(' · ')}
                    </Text>
                  ) : null}
                </View>
                <Pressable
                  onPress={() => {
                    deleteWine(getDb(), w.id);
                    refresh();
                  }}
                >
                  <Text className="text-red-500">Delete</Text>
                </Pressable>
              </View>
            ))}
          </View>
        ))
      )}

      <View className="mt-2 rounded-xl bg-white p-3 dark:bg-neutral-900">
        <Text className="mb-2 text-xs font-semibold text-neutral-500">Add a wine</Text>
        <TextInput
          placeholder="Wine name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#9A9A9A"
          className="rounded-lg bg-neutral-100 px-3 py-2 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
        />
        <View className="mt-2 flex-row flex-wrap gap-2">
          {TYPES.map((t) => (
            <Pressable
              key={t}
              onPress={() => setType(t)}
              className={`rounded-full border px-3 py-1 ${
                type === t ? 'border-amber-500 bg-amber-500' : 'border-neutral-300 dark:border-neutral-700'
              }`}
            >
              <Text className={type === t ? 'text-xs font-semibold text-black' : 'text-xs text-neutral-500'}>
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          placeholder="Region (optional)"
          value={region}
          onChangeText={setRegion}
          placeholderTextColor="#9A9A9A"
          className="mt-2 rounded-lg bg-neutral-100 px-3 py-2 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
        />
        <Pressable onPress={add} className="mt-2 items-center rounded-lg bg-amber-500 py-2">
          <Text className="font-semibold text-black">Add wine</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
