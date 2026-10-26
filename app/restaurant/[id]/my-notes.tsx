import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StarPicker } from '@/components/StarPicker';
import { useRestaurant, useRatings, useVisits } from '@/hooks/useRestaurant';
import { getDb } from '@/db/client';
import {
  setPersonalRating,
  setVisited,
  setBookmark,
  addVisit,
  deleteVisit,
} from '@/db/repo';
import { queryClient } from '@/query/client';

export default function MyNotesTab() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = String(params.id);
  const { data: r } = useRestaurant(id);
  const { data: ratings = [] } = useRatings(id);
  const { data: visits = [] } = useVisits(id);
  const [note, setNote] = useState('');

  const personal = ratings.find((x) => x.source === 'personal');
  const stars = personal?.score != null ? personal.score / 2 : 0;

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['ratings', id] });
    queryClient.invalidateQueries({ queryKey: ['visits', id] });
    queryClient.invalidateQueries({ queryKey: ['restaurant', id] });
    queryClient.invalidateQueries({ queryKey: ['restaurants'] });
  };

  if (!r) return null;

  return (
    <ScrollView className="flex-1 bg-neutral-50 px-4 py-3 dark:bg-neutral-950">
      <Text className="mb-2 text-xs font-semibold text-neutral-500">Your rating</Text>
      <StarPicker
        value={stars}
        onChange={(v) => {
          setPersonalRating(getDb(), id, v);
          refresh();
        }}
      />

      <View className="mt-5 flex-row gap-3">
        <Pressable
          onPress={() => {
            setVisited(getDb(), id, r.visited !== 1);
            refresh();
          }}
          className={`flex-1 items-center rounded-xl py-2 ${r.visited === 1 ? 'bg-teal-600' : 'bg-neutral-200 dark:bg-neutral-800'}`}
        >
          <Text className={r.visited === 1 ? 'font-semibold text-white' : 'text-neutral-500'}>
            {r.visited === 1 ? 'Visited ✓' : 'Mark visited'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setBookmark(getDb(), id, r.bookmarked !== 1);
            refresh();
          }}
          className={`flex-1 items-center rounded-xl py-2 ${r.bookmarked === 1 ? 'bg-amber-500' : 'bg-neutral-200 dark:bg-neutral-800'}`}
        >
          <Text className={r.bookmarked === 1 ? 'font-semibold text-black' : 'text-neutral-500'}>
            {r.bookmarked === 1 ? 'Bookmarked' : 'Bookmark'}
          </Text>
        </Pressable>
      </View>

      <Text className="mb-2 mt-6 text-xs font-semibold text-neutral-500">Visits</Text>
      <TextInput
        placeholder="Notes for a new visit (today)"
        value={note}
        onChangeText={setNote}
        placeholderTextColor="#9A9A9A"
        className="rounded-xl bg-white px-3 py-2 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50"
      />
      <Pressable
        onPress={() => {
          addVisit(getDb(), id, {
            visited_at: new Date().toISOString(),
            personal_rating: stars || undefined,
            personal_notes: note.trim() || undefined,
          });
          setNote('');
          setVisited(getDb(), id, true);
          refresh();
        }}
        className="mt-2 items-center rounded-xl bg-amber-500 py-2"
      >
        <Text className="font-semibold text-black">Add visit</Text>
      </Pressable>

      <View className="mt-3">
        {visits.map((v) => (
          <View
            key={v.id}
            className="mb-2 flex-row items-center justify-between rounded-xl bg-white p-3 dark:bg-neutral-900"
          >
            <View className="flex-1">
              <Text className="text-neutral-900 dark:text-neutral-50">
                {new Date(v.visited_at).toLocaleDateString()}
                {v.personal_rating != null ? `  ·  ${v.personal_rating.toFixed(1)}★` : ''}
              </Text>
              {v.personal_notes ? (
                <Text className="mt-0.5 text-xs text-neutral-500">{v.personal_notes}</Text>
              ) : null}
            </View>
            <Pressable
              onPress={() => {
                deleteVisit(getDb(), v.id);
                refresh();
              }}
            >
              <Text className="text-red-500">Delete</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
