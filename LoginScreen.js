import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const loginRes = await axios.post("http://192.168.1.51:7105/api/auth/login", {
                email,
                password
            });

            await axios.post("http://192.168.1.51:7105/api/auth/send-otp", { email });

            Alert.alert("OTP sent", "Check your email.");
            navigation.navigate('OtpScreen', { email });
        } catch (error) {
            console.log("Login error:", error?.response?.data || error.message);
            Alert.alert("Login Failed", error?.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: '/ntpc.png' }} style={styles.logo} />
            <Text style={styles.subtitle}>Employee Login</Text>

            <View style={styles.loginBox}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>LOG IN</Text>
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>
                        Don't have an account?{' '}
                        <Text
                            style={styles.signupLink}
                            onPress={() => navigation.navigate('SignupScreen')}
                        >
                            Sign up
                        </Text>
                    </Text>
                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e9f0f7',
        padding: 20,
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
    },
    loginBox: {
        width: '100%',
        maxWidth: 370,
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 12,
    },
    input: {
        backgroundColor: '#f7f9fc',
        borderColor: '#d0d7de',
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
    },
    link: {
        color: '#007bff',
        marginTop: 15,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    signupContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signupText: {
        fontSize: 14,
        color: '#444',
    },
    signupLink: {
        fontWeight: 'bold',
        color: '#007bff',
        textDecorationLine: 'underline',
    }

});
