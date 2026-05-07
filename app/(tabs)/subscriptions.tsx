import { Text, View, TextInput, FlatList } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { useState } from 'react';
import SubscriptionCard from '@/components/SubscriptionCard';
import { useSubscriptionStore } from '@/lib/subscriptionStore';
import { Feather } from '@expo/vector-icons';

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { subscriptions } = useSubscriptionStore();

  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.category
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      subscription.plan?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="pt-5 pb-5">
            <Text className="list-title pb-3">
              Subscriptions
            </Text>
            <View className="flex-row items-center rounded-full border border-border bg-background px-4 py-1">
              <Feather name="search" size={18} color="#666" />

              <TextInput
                className="flex-1 ml-2 text-base font-sans-medium text-primary"
                placeholder="Search subscriptions..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() =>
              setExpandedId(expandedId === item.id ? null : item.id)
            }
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 120,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
};
export default Subscriptions;
