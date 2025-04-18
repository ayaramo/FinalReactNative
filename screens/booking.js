import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from "react-native";
import { collection, doc, getDocs, updateDoc, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // إضافة استيراد getAuth
import useAuthStore from "../useAuthStore";
import { db } from "../firebase-config";
 const BookingPage = ({ doctorId ,closeModal } ) => {
  // console.log(`jjjj${doctorId}`);
  
  const [appointments, setAppointments] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [user, setUser] = useState(null); // إضافة حالة للمستخدم
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    
    // التحقق من حالة المستخدم عند بداية تحميل الصفحة
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    // تحميل المواعيد المتاحة
    const fetchAppointments = async () => {
      if (!doctorId) return;

      const doctorRef = doc(db, "Doctors", doctorId);
      const appointmentsRef = collection(doctorRef, "appointments");

      try {
        const snapshot = await getDocs(appointmentsRef);
        const availableAppointments = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((appointment) => {
            if (appointment.isBooked) return false;
            const appointmentDateTime = new Date(`${appointment.date}T${appointment.startTime}:00`);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return appointmentDateTime >= today;
          });

        setAppointments(availableAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }   finally {
        setIsLoading(false); // تعيين isLoading إلى false بعد الجلب
      }
    };

    fetchAppointments();

    // تنظيف الاستماع عند مغادرة الصفحة
    return () => unsubscribe();
  }, [doctorId, auth]);

  const handleBooking = async () => {
    if (!selectedTime || !selectedDate || !user) {
      Alert.alert("خطأ", "يرجى اختيار موعد وتسجيل الدخول");
      return;
    }

    try {
      const doctorRef = doc(db, "Doctors", doctorId);
      const appointmentsRef = collection(doctorRef, "appointments");
      const snapshot = await getDocs(appointmentsRef);

      const appointmentDoc = snapshot.docs.find(
        (doc) => doc.data().date === selectedDate && doc.data().startTime === selectedTime
      );

      if (!appointmentDoc) {
        Alert.alert("خطأ", "الموعد غير متاح", [
          {
            text: "OK",
            onPress: () => {
              closeModal();
            },
          },
        ]);
        return;
      }

      // تحديث الحجز في Firestore
      await updateDoc(doc(db, "Doctors", doctorId, "appointments", appointmentDoc.id), {
        isBooked: true,
      });

      // إضافة حجز المريض
      await addDoc(collection(doctorRef, "PatientBookings"), {
        date: selectedDate,
        time: selectedTime,
        patientName: user.displayName, // استخدام displayName من Firebase
        patientEmail: user.email, // استخدام email من Firebase
        createdAt: new Date(),
      });

      setAppointments((prev) => prev.filter((app) => app.id !== appointmentDoc.id));
      Alert.alert("تم", "تم حجز الموعد بنجاح", [
        {
          text: "OK",
          onPress: () => {
            closeModal(); // إغلاق المودال
            setSelectedTime("");
            setSelectedDate("");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء الحجز، حاول مرة أخرى لاحقًا", [
        {
          text: "OK",
          onPress: () => {
            closeModal();
          },
        },
      ]);
    }
  };

  return (
    <View>
    <Text style={styles.title}>📅 اختر موعد الحجز</Text>
  
    <ScrollView style={{ maxHeight: 300 }}>
      {isLoading ? (
        <Text style={styles.loadingText}>جاري تحميل المواعيد...</Text>
      ) : appointments.length > 0 ? (
        appointments.map((appointment) => {
          const isSelected =
            selectedTime === appointment.startTime && selectedDate === appointment.date;
          return (
            <TouchableOpacity
              key={appointment.id}
              style={[styles.appointmentBox, isSelected && styles.selectedAppointment]}
              onPress={() => {
                if (isSelected) {
                  setSelectedTime("");
                  setSelectedDate("");
                } else {
                  setSelectedTime(appointment.startTime);
                  setSelectedDate(appointment.date);
                }
              }}
            >
              <Text>
                {appointment.date} - {appointment.startTime} إلى {appointment.endTime}
              </Text>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text style={styles.noAppointments}>لا توجد مواعيد متاحة</Text>
      )}
    </ScrollView>
  
    <TouchableOpacity
      style={[styles.bookButton, !(selectedTime && selectedDate) && styles.disabledButton]}
      onPress={handleBooking}
      disabled={!selectedTime || !selectedDate || !user}
    >
      <Text style={styles.bookButtonText}>حجز الموعد</Text>
    </TouchableOpacity>
  </View>
  
  );
};


const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  appointmentBox: {
    backgroundColor: '#eee',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  selectedAppointment: {
    backgroundColor: '#4acbbf',
  },
  noAppointments: {
    textAlign: 'center',
    color: '#666',
  },
  bookButton: {
    marginTop: 16,
    backgroundColor: '#08473a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BookingPage;
