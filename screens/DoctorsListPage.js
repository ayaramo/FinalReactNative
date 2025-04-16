import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase-config";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const DoctorsListPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (route.params?.doctors) {
      setDoctors(route.params.doctors);
      setIsLoading(false);
    } else {
      navigation.goBack();
    }
  }, [route.params]);

  const startChat = async (doctor) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      Alert.alert("تنبيه", "يجب تسجيل الدخول أولاً لبدء المحادثة", [
        { text: "تسجيل الدخول", onPress: () => navigation.navigate('SignIn') }
      ]);
      return;
    }
  
    const patientId = currentUser.uid;
    const doctorId = doctor.id;
    const chatId = [patientId, doctorId].sort().join("_");
  
    try {
      const chatRef = doc(db, "Chats", chatId);
      const existingChat = await getDoc(chatRef);
  
      if (!existingChat.exists()) {
        const doctorInfo = {
          id: doctorId,
          name: doctor.name,
          specialty: doctor.specialty,
        };
  
        if (doctor.image) {
          doctorInfo.profileImage = doctor.image;
        }
  
        await setDoc(chatRef, {
          participants: [doctorId, patientId],
          lastMessage: "",
          lastTimestamp: new Date(),
          doctorInfo: {
            id: doctorId,
            name: doctor.name,
            specialty: doctor.specialty,
            profileImage: doctor.image || null
          },
          patientInfo: {
            id: patientId,
            name: currentUser.displayName || currentUser.email || "مريض",
            profileImage: currentUser.photoURL || null
          }
        });
        
        
        
      }
  
      navigation.navigate('Chat', { chatId, doctor });
    } catch (error) {
      console.error("فشل بدء المحادثة:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء بدء المحادثة");
    }
  };
  

  const renderDoctorImage = (doctor) => {
    if (doctor.image) {
      return (
        <Image 
          source={{ uri: doctor.image }}
          style={styles.doctorImage}
          onError={() => console.log("Failed to load image")}
        />
      );
    }
    return (
      <View style={styles.defaultIconContainer}>
        <FontAwesome name="user-circle" size={48} color="#006272" />
        <Text style={styles.defaultIconText}>{doctor.name}</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006272" />
        <Text style={styles.loadingText}>جاري تحميل بيانات الأطباء...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <FontAwesome name="arrow-left" size={20} color="#006272" />
            <Text style={styles.backButtonText}> العودة</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>قائمة الأطباء المتاحين</Text>
          <Text style={styles.subtitle}>اختر الطبيب لبدء الاستشارة</Text>
          
          <View style={styles.countBadge}>
            <Text style={styles.countText}>عدد الأطباء: {doctors.length}</Text>
          </View>
        </View>

        {/* Doctors List */}
        {doctors.length > 0 ? (
          <View style={styles.doctorsGrid}>
            {doctors.map((doctor) => (
              <View key={doctor.id} style={styles.doctorCard}>
                {/* Doctor Image Section */}
                <View style={styles.imageContainer}>
                  {renderDoctorImage(doctor)}
                  <View style={styles.imageOverlay}>
                    <Text style={styles.doctorName}>{doctor.name}</Text>
                  </View>
                </View>

                {/* Doctor Details */}
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <View style={styles.iconContainer}>
                      <FontAwesome name="user-md" size={16} color="#006272" />
                    </View>
                    <View>
                      <Text style={styles.detailLabel}>التخصص</Text>
                      <Text style={styles.detailValue}>{doctor.specialty}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.iconContainer}>
                      <MaterialIcons name="medical-services" size={16} color="#006272" />
                    </View>
                    <View>
                      <Text style={styles.detailLabel}>العيادة</Text>
                      <Text style={styles.detailValue}>{doctor.clinic || "غير محدد"}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.iconContainer}>
                      <FontAwesome name="map-marker" size={16} color="#006272" />
                    </View>
                    <View>
                      <Text style={styles.detailLabel}>الموقع</Text>
                      <Text style={styles.detailValue}>{doctor.governorate}</Text>
                    </View>
                  </View>

                  <View style={styles.footerRow}>
                    <View style={styles.ratingContainer}>
                      <FontAwesome name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{doctor.review || '--'}</Text>
                    </View>
                    <Text style={styles.priceText}>{doctor.price || '--'} ج.م</Text>
                  </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity
                  onPress={() => startChat(doctor)}
                  style={styles.chatButton}
                >
                  <FontAwesome name="comments" size={16} color="white" />
                  <Text style={styles.chatButtonText}> بدء المحادثة</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <FontAwesome name="user-md" size={48} color="#006272" />
            </View>
            <Text style={styles.emptyTitle}>لا يوجد أطباء متاحون</Text>
            <Text style={styles.emptyText}>عذرًا، لا توجد نتائج مطابقة لبحثك</Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.emptyButton}
            >
              <FontAwesome name="arrow-left" size={16} color="white" />
              <Text style={styles.emptyButtonText}> العودة للبحث</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    color: '#006272',
    fontSize: 16,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButtonText: {
    color: '#006272',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#006272',
    marginBottom: 5,
  },
  subtitle: {
    color: '#6c757d',
    marginBottom: 15,
  },
  countBadge: {
    backgroundColor: '#006272',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  countText: {
    color: 'white',
    fontWeight: '500',
  },
  doctorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  doctorCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  doctorImage: {
    width: '100%',
    height: '100%',
  },
  defaultIconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 98, 114, 0.1)',
  },
  defaultIconText: {
    color: '#006272',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
  },
  doctorName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: 'rgba(0, 98, 114, 0.1)',
    padding: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  detailLabel: {
    color: '#6c757d',
    fontSize: 12,
  },
  detailValue: {
    color: '#343a40',
    fontSize: 14,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 12,
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#343a40',
    fontWeight: '500',
    marginLeft: 4,
  },
  priceText: {
    color: '#006272',
    fontWeight: 'bold',
  },
  chatButton: {
    backgroundColor: '#006272',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  chatButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyIcon: {
    backgroundColor: 'rgba(0, 98, 114, 0.1)',
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006272',
    marginBottom: 8,
  },
  emptyText: {
    color: '#6c757d',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#006272',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default DoctorsListPage;