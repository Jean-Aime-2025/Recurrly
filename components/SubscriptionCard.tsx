import {View, Text, Image, Pressable} from 'react-native'
import React from 'react'
import {formatCurrency, formatStatusLabel, formatSubscriptionDateTime} from "@/lib/utils";
import { clsx } from "clsx";
import * as Icons from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof Icons.Feather>['name'];

// Dynamic Icon component for string-based icons
const DynamicIcon = ({ name, size = 24, color = '#081126' }: { name: IconName; size?: number; color?: string }) => {
  const IconComponent = Icons.Feather;
  return <IconComponent name={name} size={size} color={color} />;
};

const SubscriptionCard = ({ 
  name, 
  price, 
  currency, 
  icon, 
  billing, 
  color, 
  category, 
  plan, 
  renewalDate, 
  expanded, 
  onPress, 
  paymentMethod, 
  startDate, 
  status
}: SubscriptionCardProps) => {
    // Determine if icon is a string (Feather icon name) or an image source
    const isStringIcon = typeof icon === 'string';
    
    return (
        <Pressable onPress={onPress} className={clsx('sub-card', expanded ? 'sub-card-expanded' : 'bg-card')} style={!expanded && color ? { backgroundColor: color } : undefined}>
            <View className="sub-head">
                <View className="sub-main">
                    {isStringIcon ? (
                        <View className="bg-primary p-2 px-3 rounded-2xl">
                            <DynamicIcon name={icon as IconName} size={40} color="#fff" />
                        </View>
                    ) : (
                        <Image source={icon} className="sub-icon" />
                    )}
                    <View className="sub-copy">
                        <Text numberOfLines={1} className="sub-title">
                            {name}
                        </Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
                            {category?.trim() || plan?.trim() || (renewalDate ? formatSubscriptionDateTime(renewalDate) : '')}
                        </Text>
                    </View>
                </View>

                <View className="sub-price-box">
                    <Text className="sub-price">{formatCurrency(price, currency)}</Text>
                    <Text className="sub-billing">{billing}</Text>
                </View>
            </View>

            {expanded && (
                <View className="sub-bdy">
                    <View className="sub-details">
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Payment:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{paymentMethod?.trim() ?? 'Not provided'}</Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Category:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{(category?.trim() || plan?.trim()) ?? 'Not provided'}</Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Started:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{startDate ? formatSubscriptionDateTime(startDate) : 'Not provided'}</Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Renewal date:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{renewalDate ? formatSubscriptionDateTime(renewalDate) : 'Not provided'}</Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Status:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{status ? formatStatusLabel(status) : 'Not provided'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </Pressable>
    )
}
export default SubscriptionCard