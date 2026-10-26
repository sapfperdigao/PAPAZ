import { useRouter } from 'expo-router';
import { RestaurantForm } from '@/components/RestaurantForm';
import { getDb } from '@/db/client';
import { createRestaurant } from '@/db/repo';
import { queryClient } from '@/query/client';

export default function AddScreen() {
  const router = useRouter();

  return (
    <RestaurantForm
      mode="add"
      onSubmit={(input) => {
        createRestaurant(getDb(), input);
        queryClient.invalidateQueries({ queryKey: ['restaurants'] });
        router.navigate('/list');
      }}
    />
  );
}
