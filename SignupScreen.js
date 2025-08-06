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
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    
    const [departmentId, setDepartmentId] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            const response = await fetch('http://192.168.1.51:7105/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                   
                    departmentId: parseInt(departmentId),
                }),
            });

            if (!response.ok) {
                let errorMessage = 'Signup failed';
                try {
                    const text = await response.text();
                    const json = JSON.parse(text);
                    if (json && json.message) {
                        errorMessage = json.message;
                    }
                } catch (err) {
                    console.warn('Unable to parse error response as JSON');
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            Alert.alert('Success', data.message || 'Signed up successfully!');
            navigation.navigate('LoginScreen');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message || 'Network error');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: '/ntpc.png' }} style={styles.logo} />
            <Text style={styles.subtitle}>Employee Signup</Text>

            <View style={styles.signupBox}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
               
                <TextInput
                    style={styles.input}
                    placeholder="Department ID"
                    value={departmentId}
                    onChangeText={setDepartmentId}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                    <Text style={styles.buttonText}>SIGN UP</Text>
                </TouchableOpacity>

                <Text
                    onPress={() => navigation.navigate("LoginScreen")}
                    style={styles.link}
                >
                    Already have an account? Log in
                </Text>
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
    signupBox: {
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
});
