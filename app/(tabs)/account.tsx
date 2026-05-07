import { Text, View, Pressable, Image, ActivityIndicator } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useClerk, useUser } from '@clerk/expo';
import images from '@/constants/images';
import { usePostHog } from 'posthog-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const SafeAreaView = styled(RNSafeAreaView);

const Account = () => {
    const { signOut } = useClerk();
    const { user } = useUser();
    const posthog = usePostHog();
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
        if (isSigningOut) return; // Prevent multiple sign-out attempts
        
        setIsSigningOut(true);
        posthog.capture('user_signed_out');
        
        try {
            await signOut();
            // Only reset analytics after successful sign-out
            posthog.reset();
            // Navigate to splash screen
            router.replace('/splash');
        } catch (error) {
            console.error('Sign-out failed:', error);
            // Don't reset analytics if sign-out failed
            setIsSigningOut(false);
        }
    };

    const displayName = user?.firstName || user?.fullName || user?.emailAddresses[0]?.emailAddress || 'User';
    const email = user?.emailAddresses[0]?.emailAddress;

    // Show loading state while signing out
    if (isSigningOut) {
        return (
            <SafeAreaView className="flex-1 bg-background items-center justify-center">
                <View className="items-center gap-4">
                    <ActivityIndicator size="large" color="#081126" />
                    <Text className="text-lg font-sans-semibold text-primary">
                        Signing out...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="text-3xl font-sans-bold text-primary">Account</Text>

            {/* User Profile Section */}
            <View className="auth-card mt-5">
                <View className="flex-row items-center gap-4 mb-4">
                    <Image
                        source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
                        className="size-16 rounded-full"
                    />
                    <View className="flex-1">
                        <Text className="text-lg font-sans-bold text-primary">{displayName}</Text>
                        {email && (
                            <Text className="text-sm font-sans-medium text-muted-foreground">{email}</Text>
                        )}
                    </View>
                </View>
            </View>

            {/* Account Section */}
            <View className="auth-card mb-5">
                <Text className="text-base font-sans-semibold text-primary mb-3">Account</Text>
                <View className="gap-2">
                    <View className="flex-row justify-between items-center py-2">
                        <Text className="text-sm font-sans-medium text-muted-foreground">Account ID</Text>
                        <Text className="text-sm font-sans-medium text-primary" numberOfLines={1} ellipsizeMode="tail">
                            {user?.id?.substring(0, 20)}...
                        </Text>
                    </View>
                    <View className="flex-row justify-between items-center py-2">
                        <Text className="text-sm font-sans-medium text-muted-foreground">Joined</Text>
                        <Text className="text-sm font-sans-medium text-primary">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Sign Out Button */}
            <Pressable
                className="auth-button bg-destructive"
                onPress={handleSignOut}
                disabled={isSigningOut}
            >
                <Text className="auth-button-text">Sign Out</Text>
            </Pressable>
        </SafeAreaView>
    )
}

export default Account