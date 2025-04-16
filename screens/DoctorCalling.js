import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { FontAwesome } from '@expo/vector-icons';

const UNIFIED_SPECIALTIES = [
  "قلب",
  "مسالك بولية",
  "أطفال",
  "جلدية",
  "عظام",
  "أسنان",
  "عيون",
  "مخ وأعصاب",
  "باطنة",
  "التخدير",
  "جراحة عامة",
  "نساء وتوليد"
];

const governorates = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية",
  "البحر الأحمر", "البحيرة", "الفيوم", "الغربية",
  "الإسماعيلية", "المنوفية", "المنيا", "القليوبية"
];

const DoctorCalling = () => {
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      if (!specialty) {
        throw new Error("يجب اختيار التخصص أولاً");
      }

      const q = query(
        collection(db, "Doctors"),
        where("specialty", "==", specialty.trim())
      );

      const querySnapshot = await getDocs(q);
      const doctorsList = [];
      
      querySnapshot.forEach((doc) => {
        doctorsList.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log("Doctors found:", doctorsList);

      if (doctorsList.length === 0) {
        setError("لا يوجد أطباء متاحين حسب بحثك");
        return;
      }

      navigation.navigate('DoctorsList', { 
        doctors: doctorsList,
        searchQuery: specialty 
      });
    } catch (error) {
      console.error("Error searching doctors:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>الاستشارات الطبية</Text>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <FontAwesome name="user-md" size={16} color="#09243c" /> التخصص الطبي
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={specialty}
                  onValueChange={(itemValue) => setSpecialty(itemValue)}
                  style={styles.picker}
                  enabled={!loading}
                >
                  <Picker.Item label="اختر التخصص" value="" />
                  {UNIFIED_SPECIALTIES.map((spec) => (
                    <Picker.Item key={spec} label={spec} value={spec} />
                  ))}
                </Picker>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>المحافظة</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.picker}
                  enabled={!loading}
                >
                  <Picker.Item label="اختر المحافظة (اختياري)" value="" />
                  {governorates.map((gov) => (
                    <Picker.Item key={gov} label={gov} value={gov} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSearch}
            style={styles.searchButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#eca516" />
                <Text style={styles.searchButtonText}>جاري البحث...</Text>
              </>
            ) : (
              <>
                <FontAwesome name="search" size={20} color="white" />
                <Text style={styles.searchButtonText}>ابحث الآن</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#09243c',
    marginBottom: 20,
  },
  formContainer: {
    gap: 16,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    color: '#09243c',
    marginBottom: 8,
    fontWeight: '500',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  searchButton: {
    backgroundColor: '#006272',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#b91c1c',
    textAlign: 'center',
  },
});

export default DoctorCalling;