import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Dimensions
} from 'react-native';
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
    title: 'احجز موعد مع طبيب متخصص',
    icon: 'event-available',
    screen: 'BookAppointment',
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
    screen: 'Pharmacy',
    color: '#FF9800'
  }
];

const HomeScreen = ({ navigation }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

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
      console.log('Fetched doctors:', doctorsList);
      setDoctors(doctorsList); // Show all doctors
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
    }
  };

  const renderServiceCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.serviceCard, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate(item.screen)}
    >
      <MaterialIcons name={item.icon} size={32} color="#fff" />
      <Text style={styles.serviceTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderDoctorCard = ({ item }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => navigation.navigate('DoctorDetails', { doctor: item })}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.doctorImage}
      />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>د. {item.name}</Text>
        <Text style={styles.specialty}>{item.specialty}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.review || '4.5'}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
      <View style={styles.header}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>MediCross</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.aboutSection}>
          <Text style={styles.aboutText}>
             نقدم لك خدمات طبية متكاملة لتلبية احتياجاتك الصحية. احصل على أفضل رعاية طبية من خلال تطبيقنا.
          </Text>
        </View>

        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>خدماتنا</Text>
          <View style={styles.servicesContainer}>
            {services.map(service => renderServiceCard({ item: service }))}
          </View>
        </View>

        <View style={styles.doctorsSection}>
          <Text style={styles.sectionTitle}>أطباؤنا المميزون</Text>
          {/* <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث عن طبيب..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#666"
            />
          </View> */}

          <View style={styles.categoriesContainer}>
            <FlatList
              data={categories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    selectedCategory === item && styles.selectedCategory
                  ]}
                  onPress={() => setSelectedCategory(item)}
                >
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === item && styles.selectedCategoryText
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text>جاري التحميل...</Text>
            </View>
          ) : displayedDoctors.length > 0 ? (
            <View style={styles.doctorsGrid}>
              {displayedDoctors.map(doctor => renderDoctorCard({ item: doctor }))}
            </View>
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>لا يوجد أطباء متاحين</Text>
            </View>
          )}
          
          {/* View All Doctors Button */}
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('Doctors')}
          >
            <Text style={styles.viewAllButtonText}>عرض جميع الأطباء</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.viewAllIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.pharmacySection}>
          <View style={styles.pharmacyContent}>
            <Text style={styles.pharmacyTitle}>صيدليتنا</Text>
            <Text style={styles.pharmacyText}>
              احصل على أدويتك بسهولة وأمان من خلال صيدليتنا الإلكترونية
            </Text>
            <TouchableOpacity
              style={styles.pharmacyButton}
              onPress={() => navigation.navigate('Pharmacy')}
            >
              <Text style={styles.pharmacyButtonText}>تسوق الآن</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    direction: 'rtl',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2196F3',
    justifyContent :'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  aboutSection: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    height: 150,
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  servicesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'left',
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  serviceCard: {
    width: (width - 48) / 3,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceTitle: {
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
  },
  doctorsSection: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedCategory: {
    backgroundColor: '#2196F3',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  doctorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  doctorCard: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  doctorInfo: {
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
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
  pharmacySection: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  pharmacyContent: {
    alignItems: 'center',
  },
  pharmacyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  pharmacyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  pharmacyButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  pharmacyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
  },
  viewAllButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  viewAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  viewAllIcon: {
    marginLeft: 4,
  },
});

export default HomeScreen; 