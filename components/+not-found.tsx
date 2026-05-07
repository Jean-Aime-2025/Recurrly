import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NotFound = () => {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      
      {/* Icon */}
      <Ionicons name="alert-circle-outline" size={80} color="#081126" />

      {/* Title */}
      <Text className="mt-6 text-2xl font-bold text-primary">
        Page Not Found
      </Text>

      {/* Subtitle */}
      <Text className="mt-2 text-center text-muted-foreground">
        The page you&apos;re looking for doesn’t exist or has been moved.
      </Text>

      {/* Action */}
      <Pressable
        onPress={() => router.push('/(tabs)/index')}
        className="mt-6 rounded-xl bg-accent px-6 py-3"
      >
        <Text className="text-white font-semibold">
          Go Back
        </Text>
      </Pressable>

    </View>
  );
};

export default NotFound;