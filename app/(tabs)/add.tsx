import { useState } from 'react';
import { useRouter } from 'expo-router';
import { RestaurantForm } from '@/components/RestaurantForm';
import { getDb } from '@/db/client';
import { createRestaurant } from '@/db/repo';
import { queryClient } from '@/query/client';

export default function AddScreen() {
  const router = useRouter();
  // Bump the key on each submit so the form remounts fresh — the Add tab
  // stays mounted, so without this it would keep the previous entry's values.
  const [formKey, setFormKey] = useState(0);

  return (
    <RestaurantForm
      key={formKey}
      mode="add"
      onSubmit={(input) => {
        createRestaurant(getDb(), input);
        queryClient.invalidateQueries({ queryKey: ['restaurants'] });
        setFormKey((k) => k + 1);
        router.navigate('/list');
      }}
    />
  );
}
