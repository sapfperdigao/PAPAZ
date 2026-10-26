import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import type { Category, PriceRange } from '@/domain';
import type { CreateRestaurantInput } from '@/db/repo';

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
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#9A9A9A"
      className="mt-2 rounded-xl bg-white px-3 py-2 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50"
    />
  );
}

function Option({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-3 py-1 ${
        active ? 'border-amber-500 bg-amber-500' : 'border-neutral-300 dark:border-neutral-700'
      }`}
    >
      <Text className={active ? 'text-xs font-semibold text-black' : 'text-xs text-neutral-500'}>
        {label}
      </Text>
    </Pressable>
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
    <ScrollView className="flex-1 bg-neutral-50 px-4 dark:bg-neutral-950" contentContainerClassName="pb-10">
      <Field placeholder="Name" value={name} onChangeText={setName} />
      <Field placeholder="Address" value={address} onChangeText={setAddress} />
      <Field placeholder="Zone" value={zone} onChangeText={setZone} />

      <Text className="mt-4 text-xs font-semibold text-neutral-500">Category</Text>
      <View className="mt-1 flex-row flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Option
            key={c.value}
            label={c.label}
            active={category === c.value}
            onPress={() => setCategory(c.value)}
          />
        ))}
      </View>

      <Text className="mt-4 text-xs font-semibold text-neutral-500">Price</Text>
      <View className="mt-1 flex-row flex-wrap gap-2">
        {PRICES.map((p) => (
          <Option key={p} label={p} active={price === p} onPress={() => setPrice(p)} />
        ))}
      </View>

      <Field placeholder="Website" value={website} onChangeText={setWebsite} />
      <Field placeholder="Phone" value={phone} onChangeText={setPhone} />
      <Field placeholder="TheFork URL" value={theforkUrl} onChangeText={setTheforkUrl} />
      <Field placeholder="TripAdvisor URL" value={tripadvisorUrl} onChangeText={setTripadvisorUrl} />

      <Pressable
        onPress={submit}
        accessibilityState={{ disabled: !valid }}
        className={`mt-6 items-center rounded-xl py-3 ${valid ? 'bg-amber-500' : 'bg-neutral-300 dark:bg-neutral-800'}`}
      >
        <Text className="font-semibold text-black">Save</Text>
      </Pressable>

      {mode === 'edit' && onDelete ? (
        <Pressable onPress={onDelete} className="mt-4 items-center rounded-xl py-3">
          <Text className="font-semibold text-red-500">Delete restaurant</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}
