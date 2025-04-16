import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Surface, Button, ActivityIndicator, List, Avatar, useTheme, Divider } from 'react-native-paper';
import { auth, db } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import useUserStore from '../useAuthStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { logout } = useUserStore();
    const theme = useTheme();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const uid = auth.currentUser?.uid;
                if (uid) {
                    const docRef = doc(db, 'users', uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!userData) {
        return (
            <View style={styles.errorContainer}>
                <Text variant="bodyLarge">لا يمكن تحميل البيانات</Text>
                <Button mode="contained" onPress={() => navigation.goBack()} style={styles.errorButton}>
                    العودة
                </Button>
            </View>
        );
    }

    const handleLogout = async () => {
        try {
            await logout();
            navigation.navigate('login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Surface style={styles.header} elevation={4}>
                <View style={styles.headerContent}>
                    <Avatar.Image
                        size={120}
                        source={{ uri: userData.profileImage || 'https://i.pravatar.cc/150?img=12' }}
                        style={styles.avatar}
                    />
                    <View style={styles.userInfo}>
                        <Text variant="headlineSmall" style={styles.name}>{userData.name}</Text>
                        <Text variant="bodyLarge" style={styles.email}>{userData.email}</Text>
                    </View>
                </View>
            </Surface>

            <Surface style={styles.menuContainer} elevation={1}>
                <List.Section>
                    <List.Item
                        title="ملفي الشخصي"
                        left={props => <List.Icon {...props} icon="account" />}
                        right={props => <List.Icon {...props} icon="chevron-left" />}
                        onPress={() => navigation.navigate('EditProfile', { userData })}
                    />
                    <Divider />
                    <List.Item
                        title="حجوزاتي"
                        left={props => <List.Icon {...props} icon="calendar-check" />}
                        right={props => <List.Icon {...props} icon="chevron-left" />}
                        onPress={() => navigation.navigate('MyBookings')}
                    />
                    <Divider />
                    <List.Item
                        title="محادثاتي"
                        left={props => <List.Icon {...props} icon="chat" />}
                        right={props => <List.Icon {...props} icon="chevron-left" />}
                        onPress={() => navigation.navigate('MyChats')}
                    />
                    <Divider />
                    <List.Item
                        title="تسجيل الخروج"
                        left={props => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
                        onPress={handleLogout}
                        titleStyle={{ color: theme.colors.error }}
                    />
                </List.Section>
            </Surface>

            <Surface style={styles.statsContainer} elevation={1}>
                <View style={styles.statItem}>
                    <Text variant="headlineMedium" style={styles.statNumber}>
                        {userData.appointments?.length || 0}
                    </Text>
                    <Text variant="bodyMedium" style={styles.statLabel}>الحجوزات</Text>
                </View>
                <View style={styles.statItem}>
                    <Text variant="headlineMedium" style={styles.statNumber}>
                        {userData.chats?.length || 0}
                    </Text>
                    <Text variant="bodyMedium" style={styles.statLabel}>المحادثات</Text>
                </View>
            </Surface>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 60,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorButton: {
        marginTop: 16,
    },
    header: {
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    headerContent: {
        padding: 24,
        alignItems: 'center',
    },
    avatar: {
        marginBottom: 16,
    },
    userInfo: {
        alignItems: 'center',
    },
    name: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    email: {
        opacity: 0.7,
    },
    menuContainer: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
    },
    statsContainer: {
        margin: 16,
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        opacity: 0.7,
    },
});
