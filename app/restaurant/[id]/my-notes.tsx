import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StarPicker } from '@/components/StarPicker';
import { useRestaurant, useRatings, useVisits } from '@/hooks/useRestaurant';
import { getDb } from '@/db/client';
import { setPersonalRating, setVisited, setBookmark, addVisit, deleteVisit } from '@/db/repo';
import { queryClient } from '@/query/client';
import { Button } from '@/components/ui';
import { tokens } from '@/theme/tokens';

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
    queryClient.invalidateQueries({ queryKey: ['catalog'] });
    queryClient.invalidateQueries({ queryKey: ['recent-visits'] });
  };

  if (!r) return null;

  return (
    <ScrollView className="flex-1 bg-base px-4 py-3 dark:bg-base-dark">
      <Text className="mb-2 font-sans-semibold text-xs text-muted dark:text-muted-dark">
        Your rating
      </Text>
      <StarPicker
        value={stars}
        onChange={(v) => {
          setPersonalRating(getDb(), id, v);
          refresh();
        }}
      />

      <View className="mt-5 flex-row gap-3">
        <Button
          label={r.visited === 1 ? 'Visited ✓' : 'Mark visited'}
          variant={r.visited === 1 ? 'secondary' : 'ghost'}
          className="flex-1"
          onPress={() => {
            setVisited(getDb(), id, r.visited !== 1);
            refresh();
          }}
        />
        <Button
          label={r.bookmarked === 1 ? 'Bookmarked' : 'Bookmark'}
          variant={r.bookmarked === 1 ? 'primary' : 'ghost'}
          className="flex-1"
          onPress={() => {
            setBookmark(getDb(), id, r.bookmarked !== 1);
            refresh();
          }}
        />
      </View>

      <Text className="mb-2 mt-6 font-sans-semibold text-xs text-muted dark:text-muted-dark">
        Visits
      </Text>
      <TextInput
        placeholder="Notes for a new visit (today)"
        value={note}
        onChangeText={setNote}
        placeholderTextColor={tokens.color.textSecondary.light}
        className="rounded-button border border-black/10 bg-surface px-3 py-2 font-sans text-ink dark:border-white/10 dark:bg-surface-dark dark:text-ink-dark"
      />
      <View className="mt-2">
        <Button
          label="Add visit"
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
        />
      </View>

      <View className="mt-3">
        {visits.map((v) => (
          <View
            key={v.id}
            className="mb-2 flex-row items-center justify-between rounded-card border border-black/5 bg-surface p-3 dark:border-white/10 dark:bg-surface-dark"
          >
            <View className="flex-1">
              <Text className="font-sans text-ink dark:text-ink-dark">
                {new Date(v.visited_at).toLocaleDateString()}
                {v.personal_rating != null ? `  ·  ${v.personal_rating.toFixed(1)}★` : ''}
              </Text>
              {v.personal_notes ? (
                <Text className="mt-0.5 font-sans text-xs text-muted dark:text-muted-dark">
                  {v.personal_notes}
                </Text>
              ) : null}
            </View>
            <Pressable
              onPress={() => {
                deleteVisit(getDb(), v.id);
                refresh();
              }}
              accessibilityRole="button"
              accessibilityLabel="Delete visit"
              hitSlop={8}
            >
              <Text className="font-sans-semibold text-sm text-danger dark:text-danger-dark">
                Delete
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
