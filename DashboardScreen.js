import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Alert
} from 'react-native';

const DashboardScreen = ({ route, navigation }) => {
    const employee = route.params?.employee;

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: () => navigation.replace('LoginScreen') }
            ]
        );
    };

    const getInitials = (name) => {
        if (!name) return 'E';
        const initials = name.split(' ').map(word => word[0]).join('');
        return initials.slice(0, 2).toUpperCase();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{getInitials(employee?.name)}</Text>
                </View>

                <Text style={styles.header}>Welcome, {employee?.name || 'Employee'}</Text>

                <View style={styles.card}>
                    <Text style={styles.cardText}>Name: {employee?.name || 'N/A'}</Text>
                    <Text style={styles.cardText}>Email: {employee?.email || 'N/A'}</Text>
                    <Text style={styles.cardText}>Department: {employee?.departmentName || 'N/A'}</Text>
                   
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => navigation.reset({
                        index: 0,
                        routes: [{ name: 'LoginScreen' }],
                    })}
                >
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        marginTop: 20,
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    avatarText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    header: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 25,
        textAlign: 'center',
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        width: '100%',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
        marginBottom: 30,
    },
    cardText: {
        fontSize: 16,
        color: '#444',
        marginBottom: 12,
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DashboardScreen;
