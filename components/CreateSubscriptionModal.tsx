import { View, Text, Modal, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { posthog } from "@/src/config/posthog";
import * as Icons from '@expo/vector-icons';
import { getIconForSubscription } from '@/lib/utils';

// Type for icon names from Feather set (you can use Feather, Ionicons, etc.)
type IconName = React.ComponentProps<typeof Icons.Feather>['name'];

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

type Frequency = 'Monthly' | 'Yearly';
type Category = 'Entertainment' | 'AI Tools' | 'Developer Tools' | 'Design' | 'Productivity' | 'Other';
const CATEGORIES: Category[] = ['Entertainment', 'AI Tools', 'Developer Tools', 'Design', 'Productivity', 'Other'];
const CATEGORY_COLORS: Record<Category, string> = {
  'Entertainment': '#ff6b6b',
  'AI Tools': '#b8d4e3',
  'Developer Tools': '#e8def8',
  'Design': '#f5c542',
  'Productivity': '#95e1d3',
  'Other': '#d4d4d4',
};

// The Icon Component wrapper
const DynamicIcon = ({ name, size = 24, color = '#081126' }: { name: IconName; size?: number; color?: string }) => {
  // You can switch between different icon sets here
  // Using Feather as default since it has good coverage
  const IconComponent = Icons.Feather;
  return <IconComponent name={name} size={size} color={color} />;
};

const CreateSubscriptionModal = ({ visible, onClose, onSubmit }: CreateSubscriptionModalProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('Monthly');
  const [category, setCategory] = useState<Category>('Other');

  const isValidPrice = () => {
    const trimmedPrice = price.trim();
    if (!trimmedPrice) return false;
    if (!/^\s*[+-]?(\d+(\.\d+)?|\.\d+)\s*$/.test(trimmedPrice)) return false;
    const numValue = Number(trimmedPrice);
    return Number.isFinite(numValue) && numValue > 0;
  };

  const isValidForm = name.trim() !== '' && isValidPrice();

  const handleSubmit = () => {
    if (!isValidForm) return;

    const priceValue = Number(price.trim());
    const now = dayjs();
    const renewalDate = frequency === 'Monthly' ? now.add(1, 'month') : now.add(1, 'year');

    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      name: name.trim(),
      price: priceValue,
      currency: 'USD',
      //@ts-ignore
      frequency,
      category,
      status: 'active',
      startDate: now.toISOString(),
      renewalDate: renewalDate.toISOString(),
      //@ts-ignore
      icon: getIconForSubscription(name), 
      billing: frequency,
      color: CATEGORY_COLORS[category],
    };

    onSubmit(newSubscription);

    posthog.capture('subscription_created', {
      subscription_name: name.trim(),
      subscription_price: priceValue,
      subscription_frequency: frequency,
      subscription_category: category,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setFrequency('Monthly');
    setCategory('Other');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const previewIconName = name.trim() ? getIconForSubscription(name) : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <Pressable className="modal-overlay" onPress={handleClose}>
          <Pressable className="modal-container" onPress={(e) => e.stopPropagation()}>
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">✕</Text>
              </Pressable>
            </View>

            <ScrollView
              className="p-5"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
            >
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  className="auth-input"
                  placeholder="e.g., YouTube Premium, Netflix, GitHub Pro"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={name}
                  onChangeText={setName}
                />
                {previewIconName && (
                  <View className="flex-row items-center gap-2 mt-2">
                    <Text className="text-xs font-sans-medium text-muted-foreground">Preview icon:</Text>
                    <DynamicIcon name={previewIconName} size={20} color={CATEGORY_COLORS[category]} />
                    <Text className="text-xs font-sans-medium text-muted-foreground">
                      (from &quot;{name}&quot;)
                    </Text>
                  </View>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  className="auth-input"
                  placeholder="0.00"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  <Pressable
                    className={clsx('picker-option', frequency === 'Monthly' && 'picker-option-active')}
                    onPress={() => setFrequency('Monthly')}
                  >
                    <Text className={clsx('picker-option-text', frequency === 'Monthly' && 'picker-option-text-active')}>
                      Monthly
                    </Text>
                  </Pressable>
                  <Pressable
                    className={clsx('picker-option', frequency === 'Yearly' && 'picker-option-active')}
                    onPress={() => setFrequency('Yearly')}
                  >
                    <Text className={clsx('picker-option-text', frequency === 'Yearly' && 'picker-option-text-active')}>
                      Yearly
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="flex-row flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      className={clsx(
                        'px-4 py-2 rounded-full border',
                        category === cat ? 'bg-primary border-primary' : 'border-muted'
                      )}
                      onPress={() => setCategory(cat)}
                    >
                      <Text className={clsx(
                        'text-sm font-sans-medium',
                        category === cat ? 'text-white' : 'text-muted-foreground'
                      )}>
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable
                className={clsx(
                  'auth-button py-4 rounded-xl items-center',
                  isValidForm ? 'bg-primary' : 'bg-muted'
                )}
                onPress={handleSubmit}
                disabled={!isValidForm}
              >
                <Text className={clsx(
                  'text-base font-sans-bold',
                  isValidForm ? 'text-white' : 'text-muted-foreground'
                )}>
                  Create Subscription
                </Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateSubscriptionModal;