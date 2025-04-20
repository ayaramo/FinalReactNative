import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config'; // عدّل المسار حسب مكان firebase-config

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCart = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      const cartRef = doc(db, 'carts', auth.currentUser.uid);
      const cartDoc = await getDoc(cartRef);
      if (cartDoc.exists()) {
        setCart(cartDoc.data().items);
      } else {
        setCart([]);
      }
      setLoading(false);
    };

    fetchCart();
  }, []);

  const updateCartInFirestore = async (newCart) => {
    if (!auth.currentUser) return;
    const cartRef = doc(db, 'carts', auth.currentUser.uid);
    await setDoc(cartRef, { items: newCart });
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
        .filter(item => item.quantity > 0);
      updateCartInFirestore(updatedCart);
      return updatedCart;
    });
  };

  const increaseQuantity = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      updateCartInFirestore(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(item => item.id !== id);
      updateCartInFirestore(updatedCart);
      return updatedCart;
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#006272" style={{ marginTop: 50 }} />;
  }

  if (cart.length === 0) {
    return <Text style={styles.emptyText}>السلة فارغة</Text>;
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Image source={{ uri: item.img }} style={styles.image} />
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.type}>{item.type}</Text>
          <Text style={styles.price}>السعر: {item.price} جنيه</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.controlBtn}>
          <Text>➖</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={styles.controlBtn}>
          <Text>➕</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtn}>
          <Text style={{ color: 'white' }}>❌</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.totalItemPrice}>إجمالي السعر: {item.price * item.quantity} جنيه</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={styles.totalSection}>
        <Text style={styles.totalText}>إجمالي السعر: {calculateTotal()} جنيه</Text>
        <TouchableOpacity onPress={handleCheckout} style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>تأكيد الشراء</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: '#f6f6f6',
    marginTop: 25,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#006272',
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemDetails: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#006272',
  },
  type: {
    color: '#006272',
  },
  price: {
    color: '#006272',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  controlBtn: {
    backgroundColor: '#ccc',
    padding: 5,
    borderRadius: 5,
  },
  removeBtn: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  quantity: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#006272',
  },
  totalItemPrice: {
    textAlign: 'right',
    fontWeight: '600',
    color: '#006272',
  },
  totalSection: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006272',
    textAlign: 'right',
  },
  checkoutBtn: {
    backgroundColor: '#006272',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  checkoutText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});
