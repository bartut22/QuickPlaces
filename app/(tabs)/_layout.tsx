import { Stack } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function StackLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Intro',
        }}
      />
      <Stack.Screen
        name="map"
        options={{
          title: 'Map',
        }}
      />
    </Stack>
  );
}
