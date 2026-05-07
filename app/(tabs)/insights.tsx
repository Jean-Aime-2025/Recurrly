import ListHeading from '@/components/ListHeading';
import SubscriptionCard from '@/components/SubscriptionCard';
import { HOME_SUBSCRIPTIONS } from '@/constants/data';
import { useSubscriptionStore } from '@/lib/subscriptionStore';
import { posthog } from '@/src/config/posthog';
import React, { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Subscription = (typeof HOME_SUBSCRIPTIONS)[number];

const InsightsScreen = () => {
  const { subscriptions } = useSubscriptionStore();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  // Calculate real expenses from subscriptions
  const totalExpenses = useMemo(() => {
    return subscriptions.reduce((total, sub) => total + sub.price, 0);
  }, [subscriptions]);

  // Calculate month-over-month change (mock logic - compare to previous month)
  const previousMonthExpenses = useMemo(() => {
    return totalExpenses / 1.12;
  }, [totalExpenses]);

  const expenseChange = useMemo(() => {
    const change = ((totalExpenses - previousMonthExpenses) / previousMonthExpenses) * 100;
    return change.toFixed(1);
  }, [totalExpenses, previousMonthExpenses]);

  // Generate realistic chart data based on subscription prices
  const chartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat', 'Sun'];
    
    const getDayValue = (dayIndex: number) => {
      const baseValue = totalExpenses / 30;
      const variations = [0.8, 0.9, 1.0, 1.2, 1.1, 0.7, 0.6];
      const dayValue = baseValue * variations[dayIndex];
      return Math.round(dayValue * 10) / 10;
    };

    const values = days.map((_, index) => getDayValue(index));
    const maxValue = Math.max(...values);
    const maxIndex = values.indexOf(maxValue);

    // Find the maximum value to scale the chart properly
    const chartMaxValue = Math.ceil(maxValue / 5) * 5; // Round up to nearest 5

    return {
      data: days.map((day, index) => {
        const value = values[index];
        // Scale height proportionally (max height 160 based on chartMaxValue)
        const maxHeight = 160;
        const scaledHeight = (value / chartMaxValue) * maxHeight;
        
        return {
          day,
          value,
          height: Math.round(scaledHeight),
          color: index === maxIndex ? '#ea7a53' : '#081126',
          active: index === maxIndex,
        };
      }),
      maxValue: chartMaxValue,
    };
  }, [totalExpenses]);

  // Generate dynamic y-axis labels based on max value
  const yAxisLabels = useMemo(() => {
    const maxValue = chartData.maxValue;
    // Create 5 labels from 0 to maxValue
    return [
      maxValue,
      Math.round(maxValue * 0.75),
      Math.round(maxValue * 0.5),
      Math.round(maxValue * 0.25),
      0,
    ];
  }, [chartData.maxValue]);

  // Get current month name
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleSubscriptionPress = (item: Subscription) => {
    const isExpanding = expandedSubscriptionId !== item.id;
    setExpandedSubscriptionId((currentId) =>
      currentId === item.id ? null : item.id,
    );
    posthog.capture(
      isExpanding ? 'subscription_expanded' : 'subscription_collapsed',
      {
        subscription_name: item.name,
        subscription_id: item.id,
      },
    );
  };

  const ListHeader = () => {
    return (
      <View>
        <Text className="text-3xl font-sans-bold text-primary py-3 pb-5">
          Insights
        </Text>
        {/* Expenses Card with Real Data */}
        <View className="p-5 flex-row justify-between items-center rounded-2xl" style={{ backgroundColor: '#ea7a53' }}>
          <View>
            <Text className="mb-1 text-lg font-sans-bold text-white">
              Total Monthly Expenses
            </Text>
            <Text className="text-sm font-sans-semibold text-white">
              {currentMonth}
            </Text>
          </View>
          <View className="items-end">
            <Text className="mb-1 text-lg font-sans-bold text-white">
              -${totalExpenses.toFixed(2)}
            </Text>
            <Text className="text-sm font-sans-semibold text-white">
              {parseFloat(expenseChange) >= 0 ? '+' : ''}{expenseChange}% vs last month
            </Text>
          </View>
        </View>

        {/* Bar Chart Card with Dynamic Y-Axis */}
        <View
          className="p-5 rounded-2xl mt-10 mb-3"
          style={{
            backgroundColor: '#F6ECC9',
            borderWidth: 1,
            borderColor: 'rgba(0, 0, 0, 0.1)',
          }}
        >
          <Text className="text-sm font-sans-semibold text-primary mb-4">
            Daily Average Spending
          </Text>
          <View className="relative h-48 justify-end mt-2">
            {/* Background grid lines with dynamic labels */}
            <View className="absolute inset-0 justify-between pb-8">
              {yAxisLabels.map((val, idx) => (
                <View key={idx} className="flex-row items-center">
                  <Text
                    className="text-[10px] w-8 font-medium"
                    style={{
                      fontFamily: 'sans-medium',
                      color: 'rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    ${val}
                  </Text>
                  <View
                    className="flex-1 border-t border-dashed ml-2"
                    style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}
                  />
                </View>
              ))}
            </View>
            {/* Bars Row */}
            <View className="flex-row justify-between items-end pl-10">
              {chartData.data.map((item, index) => (
                <View key={index} className="items-center relative">
                  {/* Active Tooltip */}
                  {item?.active && (
                    <View className="absolute -top-9 items-center z-10 w-12">
                      <View
                        className="px-2 py-1 rounded-md shadow-sm items-center justify-center"
                        style={{ backgroundColor: '#081126' }}
                      >
                        <Text
                          className="text-[10px] font-bold"
                          style={{ fontFamily: 'sans-bold', color: '#fff9e3' }}
                        >
                          ${item.value.toFixed(1)}
                        </Text>
                      </View>
                      <View
                        className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
                        style={{ borderTopColor: '#081126', marginTop: -1 }}
                      />
                    </View>
                  )}
                  {/* The Bar */}
                  <View
                    style={{
                      width: 14,
                      height: Math.max(item.height, 4), // Minimum height of 4px for visibility
                      borderRadius: 999,
                      backgroundColor: item.color,
                    }}
                  />
                  <Text
                    className="text-[10px] font-medium mt-3"
                    style={{
                      fontFamily: 'sans-medium',
                      color: 'rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    {item?.day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <Text className="text-[10px] font-sans-medium text-center text-muted-foreground mt-4">
            *Daily average based on your {subscriptions.length} active subscriptions
          </Text>
        </View>

        <ListHeading title="All Subscriptions" />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff9e3' }}>
      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => handleSubscriptionPress(item)}
          />
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 120,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default InsightsScreen;