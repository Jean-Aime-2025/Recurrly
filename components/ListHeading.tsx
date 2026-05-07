import { router } from 'expo-router'
import {View, Text, TouchableOpacity} from 'react-native'

const ListHeading = ({ title }: ListHeadingProps) => {
    return (
        <View className="list-head">
            <Text className="list-title">{title}</Text>

            <TouchableOpacity className="list-action" onPress={()=>router.push('/(tabs)/subscriptions')}>
                <Text className="list-action-text">View all</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ListHeading