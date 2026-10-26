import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RestaurantForm } from '@/components/RestaurantForm';
import { useRestaurant } from '@/hooks/useRestaurant';
import { getDb } from '@/db/client';
import { updateRestaurant, deleteRestaurant } from '@/db/repo';
import { queryClient } from '@/query/client';

export default function EditRestaurant() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = String(params.id);
  const router = useRouter();
  const { data: r } = useRestaurant(id);

  if (!r) return null;

  return (
    <RestaurantForm
      mode="edit"
      initial={{
        name: r.name,
        category: r.category,
        price_range: r.price_range ?? undefined,
        address: r.address ?? undefined,
        zone: r.zone ?? undefined,
        website: r.website ?? undefined,
        phone: r.phone ?? undefined,
        thefork_url: r.thefork_url ?? undefined,
        tripadvisor_url: r.tripadvisor_url ?? undefined,
      }}
      onSubmit={(input) => {
        updateRestaurant(getDb(), id, input);
        queryClient.invalidateQueries({ queryKey: ['restaurant', id] });
        queryClient.invalidateQueries({ queryKey: ['restaurants'] });
        router.back();
      }}
      onDelete={() => {
        Alert.alert('Delete restaurant', `Delete "${r.name}"? This cannot be undone.`, [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deleteRestaurant(getDb(), id);
              queryClient.invalidateQueries({ queryKey: ['restaurants'] });
              router.replace('/list');
            },
          },
        ]);
      }}
    />
  );
}
