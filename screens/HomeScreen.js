import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions
} from 'react-native';
import { Text, Surface, Searchbar, ActivityIndicator, useTheme, Button } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const categories = [
  'الكل',
  'طب عام',
  'أسنان',
  'جلدية',
  'أطفال',
  'نساء',
  'عيون',
  'أنف وأذن',
];

const services = [
  {
    id: '1',
    title: 'احجز موعد  متخصص',
    icon: 'event-available',
    screen: 'Doctorlist',
    color: '#4CAF50'
  },
  {
    id: '2',
    title: 'تحدث مع طبيبك',
    icon: 'chat',
    screen: 'Chat',
    color: '#2196F3'
  },
  {
    id: '3',
    title: 'اشتر أدويتك',
    icon: 'local-pharmacy',
    screen: 'PharmacyScreen',
    color: '#FF9800'
  }
];

const HomeScreen = ({ navigation }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Doctors'));
      const doctorsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDoctors(doctorsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
    }
  };
  const renderServiceCard = ({ item }) => (
    <Surface style={[styles.serviceCard, { backgroundColor: item.color }]} elevation={4} key={item.id}>
      <TouchableOpacity
        style={styles.serviceCardContent}
        onPress={() => navigation.navigate(item.screen)}
      >
        <MaterialIcons name={item.icon} size={32} color="#fff" />
        <Text style={styles.serviceTitle}>{item.title}</Text>
      </TouchableOpacity>
    </Surface>
  );
  
  const renderDoctorCard = ({ item }) => (
    <Surface style={styles.doctorCard} elevation={2} key={item.id}>
      <TouchableOpacity
        onPress={() => navigation.navigate('DoctorDetails', { doctor: item })}
      >
        <Image

source={
  item.image
    ? { uri: item.image }
    : require("../assets/Avatar-Doctor.jpg") // عدلي المسار حسب مكان الصورة
  }



           style={styles.doctorImage}
        />
        <View style={styles.doctorInfo}>
          <Text variant="titleMedium" style={styles.doctorName}>د. {item.name}</Text>
          <Text variant="bodyMedium" style={styles.specialty}>{item.specialty}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text variant="bodyMedium" style={styles.rating}>{item.review || '4.5'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Surface>
  );
  

  const filteredDoctors = doctors.filter(doctor => {
    if (!doctor) return false;

    const name = doctor.name ? doctor.name.toLowerCase() : '';
    const specialty = doctor.specialty ? doctor.specialty : '';

    const matchesCategory = selectedCategory === 'الكل' || specialty === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      name.includes(searchQuery.toLowerCase()) ||
      specialty.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const displayedDoctors = filteredDoctors.slice(0, 6);

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header} elevation={4}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Text variant="headlineSmall" style={styles.headerTitle}>MediCross</Text>
      </Surface>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Surface style={styles.aboutSection} elevation={1}>
          <Text variant="bodyLarge" style={styles.aboutText}>
            نقدم لك خدمات طبية متكاملة لتلبية احتياجاتك الصحية. احصل على أفضل رعاية طبية من خلال تطبيقنا.
          </Text>
        </Surface>

        <View style={styles.servicesSection}>
          <Text variant="titleLarge" style={styles.sectionTitle}>خدماتنا</Text>
          <View style={styles.servicesContainer}>
            {services.map(service => renderServiceCard({ item: service }))}
          </View>
        </View>

        <View style={styles.doctorsSection}>
          <Text variant="titleLarge" style={styles.sectionTitle}>أطباؤنا المميزون</Text>

          <Searchbar
            placeholder="ابحث عن طبيب..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            iconColor={theme.colors.primary}
            inputStyle={{ writingDirection: 'rtl' }} // تحديد الكتابة من اليمين لليسار
            direction="rtl" // تحديد اتجاه الكتابة      
            textAlign="right" // محاذاة النص لليمين          
          />

          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((category) => (
                <Button
                  key={category}
                  mode={selectedCategory === category ? "contained" : "outlined"}
                  onPress={() => setSelectedCategory(category)}
                  style={styles.categoryButton}
                  labelStyle={styles.categoryButtonLabel}
                  buttonColor={selectedCategory === category ? '#2196F3' : undefined} // اللون الأزرق الداكن
                  textColor={selectedCategory === category ? '#fff' : '#2196F3'}
                >
                  {category}
                </Button>
              ))}
            </ScrollView>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : displayedDoctors.length > 0 ? (
            <View style={styles.doctorsGrid}>
              {displayedDoctors.map(doctor => renderDoctorCard({ item: doctor }))}
            </View>
          ) : (
            <Surface style={styles.noResultsContainer} elevation={1}>
              <Text variant="bodyLarge" style={styles.noResultsText}>لا يوجد أطباء متاحين</Text>
            </Surface>
          )}

          <Button
            mode="contained"
            onPress={() => navigation.navigate('Doctors')}
            style={styles.viewAllButton}
            icon="arrow-right"
          >
            عرض جميع الأطباء
          </Button>
        </View>

        <Surface style={styles.pharmacySection} elevation={4}>
          <View style={styles.pharmacyContent}>
            <Text variant="headlineSmall" style={styles.pharmacyTitle}>صيدليتنا</Text>
            <Text variant="bodyLarge" style={styles.pharmacyText}>
              احصل على أدويتك بسهولة وأمان من خلال صيدليتنا الإلكترونية
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('الصيدلية')}
              style={styles.pharmacyButton}
              icon="shopping"
            >
              تسوق الآن
            </Button>
          </View>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    direction: 'rtl',
    backgroundColor: '#2196F3',

  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  aboutSection: {
    // margin: 16,
    padding: 16,
    // borderRadius: 8,
    backgroundColor: '#2196F3',
  },
  aboutText: {
    textAlign: 'center',
    color: '#fff',
  },
  servicesSection: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    textAlign: 'left',
    color: '#333',
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    direction: 'rtl',

  },
  serviceCard: {
    width: width / 3.5,
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  serviceCardContent: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  searchbar: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 0,
    backgroundColor: '#fff',

  },
  categoriesContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
    direction: 'rtl',

  },
  categoryButton: {
    marginRight: 8,
    borderRadius: 20,
  },
  categoryButtonLabel: {
    fontSize: 12,
  },
  doctorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  doctorCard: {
    width: width / 2.2,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    direction: 'rtl',

  },
  doctorImage: {
    width: '100%',
    height: 150,
  },
  doctorInfo: {
    padding: 12,
    textAlign: 'center',
    alignItems: 'center',
  },
  doctorName: {
    marginBottom: 4,
  },
  specialty: {
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    color: '#666',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  noResultsContainer: {
    padding: 32,
    margin: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  viewAllButton: {
    margin: 16,
    backgroundColor: '#2196F3',

  },
  pharmacySection: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#C6D6E2FF',
    direction: 'rtl',

  },
  pharmacyContent: {
    padding: 24,
  },
  pharmacyTitle: {
    color: 'black',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  pharmacyText: {
    color: 'black',
    marginBottom: 16,
  },

  pharmacyButton: {
    backgroundColor: '#2196F3',
  },
});

export default HomeScreen; 