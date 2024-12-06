import { ExternalLink } from "@/components/ExternalLink";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Link, Redirect, useRouter } from "expo-router";
import { StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function IntroScreen() {
    const colorScheme = useColorScheme();
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background}}>
            <ThemedView style={styles.container}>
                <ThemedText style={styles.heroText}>Welcome to QuickPlaces!</ThemedText>

                {/* four 100% width images that have an aspect ratio of 3:1 and lie on top of each other */}
                <Image source={require('@/assets/images/pexels-apasaric-2105239.jpg')} style={styles.heroImg} />
                <Image source={require('@/assets/images/pexels-pixabay-346286.jpg')} style={styles.heroImg} />
                <Image source={require('@/assets/images/pexels-radchopra-333645.jpg')} style={styles.heroImg} />
                <Image source={require('@/assets/images/pexels-zhangkaiyv-650231.jpg')} style={styles.heroImg} />

                <TouchableOpacity style={styles.button} onPress={() => router.replace('/map')}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </ThemedView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        padding: 0,
    },
    heroText: {
        padding: 16,
        marginVertical: 16,
        lineHeight: 48,
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
    },
    heroImg: {
        width: '100%',
        height: "auto",
        resizeMode: 'cover',
        // maxHeight:`   
        aspectRatio: 4/1,
    },
    h2: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    button: {
        backgroundColor: Colors.light.tint,
        padding: 16,
        borderRadius: 8,
        margin: 16,
    },

    buttonText: {
        color: Colors.light.background,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});