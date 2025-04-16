import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

const MedicinesScreen = () => {
  const route = useRoute();
  const { id, title } = route.params;

  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchMedicines = async () => {
      const medsRef = collection(db, "pharmacy", id, "medicines");
      const snapshot = await getDocs(medsRef);
      const medsList = snapshot.docs.map(doc => ({
        id: doc.id,
        count: 0,
        ...doc.data()
      }));
      setMedicines(medsList);
    };

    fetchMedicines();
  }, [id]);

  const updateCount = (id, newCount) => {
    setMedicines(prev =>
      prev.map(med =>
        med.id === id ? { ...med, count: newCount } : med
      )
    );
  };

  const filteredMedicines = medicines.filter(med =>
    med.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedType === '' || med.type === selectedType)
  );

  const types = ["أقراص", "عبوة", "حقن", "كبسولات", "جهاز", "مجموعة", "حفاضات", "اكياس", "لصقات", "شراب"];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>قسم: {title}</Text>

      <View style={styles.filterContainer}>
        <TextInput
          placeholder="ابحث عن دواء"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, selectedType === '' && styles.selectedButton]}
            onPress={() => setSelectedType('')}
          >
            <Text style={styles.buttonText}>الكل</Text>
          </TouchableOpacity>
          {types.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.button, selectedType === type && styles.selectedButton]}
              onPress={() => setSelectedType(type)}
            >
              <Text style={styles.buttonText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredMedicines}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.img }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.type}</Text>
            <Text style={styles.price}>السعر: {item.price} جنيه</Text>

            {item.count > 0 ? (
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  onPress={() => updateCount(item.id, item.count - 1)}
                  style={styles.counterButton}
                >
                  <Text style={styles.buttonText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.counterNumber}>{item.count}</Text>

                <TouchableOpacity
                  onPress={() => updateCount(item.id, item.count + 1)}
                  style={styles.counterButton}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => updateCount(item.id, 1)}
              >
                <Text style={styles.addButtonText}>إضافة + </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default MedicinesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 12, marginTop: 20 , paddingTop: 40,},
  header: { fontSize: 20, fontWeight: 'bold', textAlign: 'left', marginBottom: 10, color: '#09243c' },
  filterContainer: { marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, backgroundColor: '#fff', textAlign: 'right', width: '95%', marginLeft: 10, marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#FFFFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 4,
  },
  selectedButton: {
    backgroundColor: '#4acbbf',
  },
  buttonText: {
    color: '#09243c',
    fontWeight: '600',
  },
  grid: { paddingBottom: 100 },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    margin: 8,
    alignItems: 'center',
    flex: 1,
    elevation: 3,
  },
  image: { width: 120, height: 120, borderRadius: 12 },
  title: { marginTop: 8, fontSize: 16, fontWeight: '600', color: '#09243c', textAlign: 'center' },
  subtitle: { color: '#555', marginTop: 4 },
  price: { marginTop: 4, fontWeight: 'bold', color: '#1f2937' },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    width: '100%',
  },
  counterButton: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  counterNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#09243c',
  },
  addButton: {
    backgroundColor: '#4acbbf', // لون أخضر فاتح
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
