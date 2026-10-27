import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import type { Category, PriceRange } from '@/domain';
import type { CreateRestaurantInput } from '@/db/repo';
import { Chip, Button, SectionHeader } from '@/components/ui';
import { useThemeColors } from '@/hooks/useThemeColors';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'tasca', label: 'Tasca' },
  { value: 'cervejaria', label: 'Cervejaria' },
  { value: 'marisqueira', label: 'Marisqueira' },
  { value: 'other', label: 'Other' },
];
const PRICES: PriceRange[] = ['€', '€€', '€€€', '€€€€'];

function Field({
  placeholder,
  value,
  onChangeText,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
}) {
  const c = useThemeColors();
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={c.muted}
      accessibilityLabel={placeholder}
      className="mt-2 rounded-button border border-black/10 bg-surface px-3 py-2.5 font-sans text-ink dark:border-white/10 dark:bg-surface-dark dark:text-ink-dark"
    />
  );
}

export function RestaurantForm({
  mode,
  initial,
  onSubmit,
  onDelete,
}: {
  mode: 'add' | 'edit';
  initial?: Partial<CreateRestaurantInput>;
  onSubmit: (input: CreateRestaurantInput) => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [address, setAddress] = useState(initial?.address ?? '');
  const [zone, setZone] = useState(initial?.zone ?? '');
  const [category, setCategory] = useState<Category | undefined>(initial?.category);
  const [price, setPrice] = useState<PriceRange | undefined>(initial?.price_range);
  const [website, setWebsite] = useState(initial?.website ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [theforkUrl, setTheforkUrl] = useState(initial?.thefork_url ?? '');
  const [tripadvisorUrl, setTripadvisorUrl] = useState(initial?.tripadvisor_url ?? '');

  const valid = name.trim().length > 0 && !!category && !!price;

  const submit = () => {
    if (!valid) return;
    const trimmed = (s: string) => (s.trim() ? s.trim() : undefined);
    onSubmit({
      name: name.trim(),
      category: category!,
      price_range: price!,
      address: trimmed(address),
      zone: trimmed(zone),
      website: trimmed(website),
      phone: trimmed(phone),
      thefork_url: trimmed(theforkUrl),
      tripadvisor_url: trimmed(tripadvisorUrl),
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-base px-4 dark:bg-base-dark"
      contentContainerClassName="pb-10"
    >
      <View className="mt-3">
        <SectionHeader title="Details" />
        <Field placeholder="Name" value={name} onChangeText={setName} />
        <Field placeholder="Address" value={address} onChangeText={setAddress} />
        <Field placeholder="Zone" value={zone} onChangeText={setZone} />
      </View>

      <View className="mt-5">
        <SectionHeader title="Category" />
        <View className="flex-row flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip
              key={c.value}
              label={c.label}
              active={category === c.value}
              onPress={() => setCategory(c.value)}
            />
          ))}
        </View>
      </View>

      <View className="mt-5">
        <SectionHeader title="Price" />
        <View className="flex-row flex-wrap gap-2">
          {PRICES.map((p) => (
            <Chip key={p} label={p} active={price === p} onPress={() => setPrice(p)} />
          ))}
        </View>
      </View>

      <View className="mt-5">
        <SectionHeader title="Links" />
        <Field placeholder="Website" value={website} onChangeText={setWebsite} />
        <Field placeholder="Phone" value={phone} onChangeText={setPhone} />
        <Field placeholder="TheFork URL" value={theforkUrl} onChangeText={setTheforkUrl} />
        <Field
          placeholder="TripAdvisor URL"
          value={tripadvisorUrl}
          onChangeText={setTripadvisorUrl}
        />
      </View>

      <View className="mt-6">
        <Button label="Save" onPress={submit} disabled={!valid} />
      </View>

      {mode === 'edit' && onDelete ? (
        <Pressable
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete restaurant"
          className="mt-4 min-h-11 items-center justify-center py-3"
        >
          <Text className="font-sans-semibold text-danger dark:text-danger-dark">
            Delete restaurant
          </Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}
