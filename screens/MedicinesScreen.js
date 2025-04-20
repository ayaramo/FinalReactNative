import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { useNavigation, useRoute } from '@react-navigation/native';

const MedicinesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, title } = route.params;

  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [cart, setCart] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  const types = [
    'أقراص',
    'عبوة',
    'حقن',
    'كبسولات',
    'جهاز',
    'مجموعة',
    'حفاضات',
    'اكياس',
    'لصقات',
    'شراب',
  ];

  useEffect(() => {
    const fetchMedicines = async () => {
      const medsRef = collection(db, 'pharmacy', id, 'medicines');
      const snapshot = await getDocs(medsRef);
      const medsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMedicines(medsList);
    };

    fetchMedicines();
  }, [id]);

  const addToCart = (medicine) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === medicine.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...medicine, quantity: 1 }];
      }
    });

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  useEffect(() => {
    const saveCartToFirestore = async () => {
      const user = auth.currentUser;
      if (user) {
        const cartRef = doc(db, 'carts', user.uid);
        try {
          await setDoc(cartRef, { items: cart });
          console.log('تم حفظ السلة في Firebase');
        } catch (error) {
          console.error('خطأ في حفظ السلة:', error);
        }
      }
    };

    if (cart.length > 0) {
      saveCartToFirestore();
    }
  }, [cart]);

  const filteredMedicines = medicines.filter(
    (med) =>
      med.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedType === '' || med.type === selectedType)
  );

  return (
    <View style={styles.container}>
      {showNotification && (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>تمت الإضافة إلى السلة ✅</Text>
        </View>
      )}

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.cartButtonText}>🛒 السلة</Text>
          {cart.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن دواء"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Text style={styles.sectionTitle}>أنواع الأدوية:</Text>

      <View style={styles.filterContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, selectedType === '' && styles.selectedButton]}
            onPress={() => setSelectedType('')}
          >
            <Text
              style={[
                styles.buttonText,
                selectedType === '' && styles.selectedButtonText,
              ]}
            >
              الكل
            </Text>
          </TouchableOpacity>

          {types.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.button, selectedType === type && styles.selectedButton]}
              onPress={() => setSelectedType(type)}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedType === type && styles.selectedButtonText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredMedicines}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.medsList}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.img }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.type}</Text>
            <Text style={styles.price}>السعر: {item.price} جنيه</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addButtonText}>إضافة +</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default MedicinesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 12,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
  },
  notification: {
    position: 'absolute',
    top: 30,
    left: '20%',
    right: '20%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  notificationText: {
    color: '#006272',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  cartButton: {
    backgroundColor: '#006272',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: 'relative',
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#facc15',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#09243c',
    marginBottom: 8,
    textAlign: 'right',
  },
  filterContainer: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 4,
  },
  selectedButton: {
    backgroundColor: '#004f59',
  },
  buttonText: {
    color: '#09243c',
    fontWeight: '600',
  },
  selectedButtonText: {
    color: 'white',
  },
  medsList: {
    paddingBottom: 100,
    marginTop: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    margin: 8,
    alignItems: 'center',
    flex: 1,
    elevation: 3,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#09243c',
    textAlign: 'center',
  },
  subtitle: {
    color: '#555',
    marginTop: 4,
  },
  price: {
    marginTop: 4,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#004f59',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
