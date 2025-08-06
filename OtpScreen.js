import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image
} from 'react-native';
import axios from 'axios';

const OtpScreen = ({ route, navigation }) => {
    const { email } = route.params;
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerifyOtp = async () => {
        if (!otp) {
            Alert.alert('Error', 'Please enter the OTP.');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('http://192.168.1.51:7105/api/auth/verify-otp', {
                email,
                otp
            });

            navigation.replace('DashboardScreen', { employee: res.data });
        } catch (err) {
            Alert.alert('Invalid OTP', err.response?.data || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: '/ntpc.png' }} style={styles.logo} />
            <Text style={styles.title}>OTP Verification</Text>
            <Text style={styles.subtitle}>Enter the OTP sent to {email}</Text>

            <View style={styles.card}>
                <TextInput
                    placeholder="Enter 6-digit OTP"
                    style={styles.input}
                    keyboardType="numeric"
                    value={otp}
                    onChangeText={setOtp}
                    maxLength={6}
                />

                <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
                    {loading
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.buttonText}>Verify OTP</Text>
                    }
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e9f0f7',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 25,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        padding: 25,
        width: '100%',
        maxWidth: 380,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,
    },
    input: {
        backgroundColor: '#f7f9fc',
        borderColor: '#d0d7de',
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
    }
});

export default OtpScreen;
