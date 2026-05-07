import { View, Text, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const Splash = () => {
  return (
    <View className="flex-1 flex-col justify-center items-center bg-accent px-6 gap-10">
      {/* Image */}
      <Image
        source={require('@/assets/images/splash-pattern.png')}
        className="h-[60%] px-1"
        resizeMode="contain"
      />

      <View className="w-full gap-2">
        {/* Title (optional) */}
        <Text className="text-4xl font-sans-bold text-white text-center">
          Gain Financial Clarity
        </Text>
        <Text className="mb-1 text-lg font-sans-meduim text-white text-center">
          Track, analyze and cancel with ease
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity
          onPress={() => router.push('/sign-in')}
          className="bg-white px-8 py-3 rounded-full"
        >
          <Text className="text-primary font-sans-bold text-center w-full font-semibold text-base py-2">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </View>
  );
};

export default Splash;
