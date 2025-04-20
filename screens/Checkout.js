import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { db, auth } from '../firebase-config';
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';

function Checkout() {
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [Cart, setCart] = useState([]);
  const [userName, setUserName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showWebView, setShowWebView] = useState(false);

  useEffect(() => {
    const fetchCartAndUser = async () => {
      if (!auth.currentUser) return;

      const cartRef = doc(db, 'carts', auth.currentUser.uid);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        const data = cartSnap.data();
        setCart(data.items || []);
      }

      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserName(userSnap.data().name || 'مستخدم');
      }
    };

    fetchCartAndUser();
  }, []);

  const totalPrice = Cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const confirmOrder = async () => {
    const orderData = {
      items: Cart,
      shippingAddress,
      paymentMethod,
      totalPrice,
      status: 'confirmed',
      date: new Date(),
      userId: auth.currentUser?.uid,
    };

    await addDoc(collection(db, 'orders'), orderData);
    await setDoc(doc(db, 'carts', auth.currentUser.uid), { items: [] });

    setOrderDetails(orderData);
    setShowModal(true);
    setShowWebView(false);
  };

  const handleCloseModal = async () => {
    await setDoc(doc(db, 'carts', auth.currentUser.uid), { items: [] });
  
    setCart([]);
  
    setShowModal(false);
    setShippingAddress('');
    setPaymentMethod('');
    setOrderDetails(null);
  };
  

  const handleWebViewNavigation = (navState) => {
    if (navState.url.includes('success')) {
      confirmOrder();
    } else if (navState.url.includes('cancel')) {
      setShowWebView(false);
      Alert.alert('تم إلغاء الدفع');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🛒 تفاصيل السلة</Text>
        {Cart.map((item) => (
          <View key={item.id} style={styles.item}>
            <Text>{item.title} ({item.quantity})</Text>
            <Text>{item.price * item.quantity} جنيه</Text>
          </View>
        ))}
        <Text style={styles.total}>إجمالي السعر: {totalPrice} جنيه</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>📦 عنوان الشحن</Text>
        <TextInput
          placeholder="أدخل عنوان الشحن"
          value={shippingAddress}
          onChangeText={setShippingAddress}
          style={styles.input}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>💳 طريقة الدفع</Text>
        <View style={styles.paymentMethodContainer}>
          <TouchableOpacity
            style={styles.paymentMethodButton}
            onPress={() => setPaymentMethod('paypal')}
          >
            <Text style={styles.paymentMethodText}>باي بال</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.paymentMethodButton}
            onPress={() => setPaymentMethod('creditCard')}
          >
            <Text style={styles.paymentMethodText}>بطاقة ائتمانية</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.paymentMethodButton}
            onPress={() => setPaymentMethod('bankTransfer')}
          >
            <Text style={styles.paymentMethodText}>تحويل بنكي</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="تأكيد الدفع"
          onPress={() => {
            if (!shippingAddress || !paymentMethod) {
              Alert.alert('من فضلك أكمل بيانات الدفع والعنوان');
              return;
            }

            if (paymentMethod === 'paypal') {
              setShowWebView(true);
            } else {
              confirmOrder();
            }
          }}
          color="#006272"
        />
      </View>

      {showWebView && (
        <Modal visible={true}>
          <WebView
            source={{ uri: 'https://www.sandbox.paypal.com/checkoutnow?token=TEST_ORDER_ID' }}
            onNavigationStateChange={handleWebViewNavigation}
            startInLoadingState
          />
        </Modal>
      )}

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>✅ تم تأكيد الطلب</Text>
            <Text>👤 المستخدم: {userName}</Text>
            <Text>📍 العنوان: {orderDetails?.shippingAddress}</Text>
            <Text>💳 الدفع: {orderDetails?.paymentMethod}</Text>
            <Text>💰 الإجمالي: {orderDetails?.totalPrice} جنيه</Text>

            {orderDetails?.items.map((item, index) => (
              <Text key={index}>
                - {item.title}: {item.quantity} × {item.price}
              </Text>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
              <Text style={styles.buttonText}>تم</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#f3f4f6', marginTop: 20 },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 20, 
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#006272', marginBottom: 10 },
  item: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  total: { fontWeight: 'bold', marginTop: 10 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlign: 'right',
    marginTop: 10,
  },
  paymentMethodContainer: {
    marginTop: 10,
  },
  paymentMethodButton: {
    backgroundColor: '#006272',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentMethodText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonContainer: { marginTop: 20 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    width: '85%',
    borderRadius: 10,
    alignItems: 'flex-start',
  },
  button: {
    backgroundColor: '#006272',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Checkout;
