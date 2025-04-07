import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import img1 from '../assets/download1.jpg';
import img2 from '../assets/download-_1_.jpg';
import img3 from '../assets/1a0d3713-7045-46c8-90e3-41c8d2a85f98.png';
import img4 from '../assets/e5d02a28-b378-4e1a-8f8c-e1d0668e2c0c.jpeg';
import img5 from '../assets/3.jpg';
import img6 from '../assets/4.jpg';
import img7 from '../assets/6.jpg';
import img8 from '../assets/7.jpg';
import img9 from '../assets/8.jpg';
import img10 from '../assets/12.jpg';
import img11 from '../assets/11.jpg';
import img12 from '../assets/101.jpg';

const categories = [
  { img: img1, title: "العناية بالأم والطفل", id: "motherandchildcare" },
  { img: img2, title: "أدوية بدون روشتة", id: "overthecountermedications" },
  { img: img3, title: "الأدوية الوصفية", id: "prescriptionmedications" },
  { img: img4, title: "العروض", id: "offers" },
  { img: img5, title: "الفيتامينات والتغذية", id: "vitaminsandnutrition" },
  { img: img6, title: "مكافحة العدوي", id: "antivirus" },
  { img: img7, title: "العناية بالوجه والجسم", id: "faceandbodycare" },
  { img: img8, title: "العناية بالمرأة", id: "womencare" },
  { img: img9, title: "العناية بالرجل", id: "mencare" },
  { img: img10, title: "العناية بالشعر", id: "haircare" },
  { img: img11, title: "مستلزمات طبية", id: "medicalsupplies" },
  { img: img12, title: "كبار السن", id: "oldpeople" }
];

const PharmacyScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MedicinesScreen', { id: item.id, title: item.title })}
      accessibilityLabel={`انتقل إلى قسم ${item.title}`}
    >
      <Image source={item.img} style={styles.image} resizeMode="cover" />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ابحث بالقسم</Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f4f6',
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 20,
    marginBottom: 16,
    paddingRight: 32,
    color: '#09243c',
  },
  grid: {
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    margin: 8,
    alignItems: 'center',
    flex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#09243c',
    textAlign: 'center',
  },
});

export default PharmacyScreen;
