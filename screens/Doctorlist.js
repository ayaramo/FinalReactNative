
import BookingPage from './booking'; // تأكد من وجود الملف بنفس المكان




import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, Card, Title, Paragraph } from "react-native-paper";

const DoctorsList = () => {
  const [isModalVisible, setModalVisiblability] = useState(false);


  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [governorateFilter, setGovernorateFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);


  useEffect(() => {
    const fetchDoctors = async () => {
      const querySnapshot = await getDocs(collection(db, "Doctors"));
      const doctorsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        specialty: doc.data().specialty || "",
        governorate: doc.data().governorate || "",
        price: doc.data().price || 0,
        review: doc.data().review || 0,
        ...doc.data(),
      }));

      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData);
      setIsLoading(false);

      const uniqueSpecialties = [...new Set(doctorsData.map((doc) => doc.specialty))].filter(Boolean);
      setSpecialties(uniqueSpecialties);

      const uniqueGovernorates = [...new Set(doctorsData.map((doc) => doc.governorate))].filter(Boolean);
      setGovernorates(uniqueGovernorates);
    };

    fetchDoctors();
  }, []);






  const closeModal = () => {
    // تأخير خفيف بعد إغلاق الأنيميشن
    setTimeout(() => {
      setModalVisiblability(false);
      setSelectedDoctorId(null); // امسح الـ id بعد الغلق
    }, 200); // نفس مدة animationType="slide"
  };




  useEffect(() => {
    handleFilterChange();
  }, [specialtyFilter, governorateFilter, ratingFilter, priceFilter, searchQuery]);

  const handleFilterChange = () => {
    let filtered = doctors.filter((doc) =>
      (specialtyFilter === "" || doc.specialty === specialtyFilter) &&
      (governorateFilter === "" || doc.governorate === governorateFilter) &&
      (ratingFilter === "" || doc.review >= parseFloat(ratingFilter)) &&
      (priceFilter === "" ||
        (priceFilter === "100" && doc.price < 100) ||
        (priceFilter === "300" && doc.price < 300) ||
        (priceFilter === "500" && doc.price < 500) ||
        (priceFilter === "501" && doc.price >= 500)) &&
      (searchQuery === "" ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.governorate.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredDoctors(filtered);
  };

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const selectOption = (value) => {
    switch (modalType) {
      case "specialty":
        setSpecialtyFilter(value);
        break;
      case "governorate":
        setGovernorateFilter(value);
        break;
      case "rating":
        setRatingFilter(value);
        break;
      case "price":
        setPriceFilter(value);
        break;
    }
    setModalVisible(false);
  };

  const getOptions = () => {
    switch (modalType) {
      case "specialty":
        return specialties;
      case "governorate":
        return governorates;
      case "rating":
        return ["4", "3"];
      case "price":
        return ["100", "300", "500", "501"];
      default:
        return [];
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#193849" style={{ marginTop: 40 }} />;
  }

  const renderDoctor = ({ item }) => (



    <Card style={styles.card}>
      <Card.Cover
        source={
          item.image
            ? { uri: item.image }
            : require("../assets/Avatar-Doctor.jpg") // عدلي المسار حسب مكان الصورة
        }
      />










      <Card.Content>
        <Title style={styles.name}>{item.name}</Title>
        <Paragraph>التخصص: {item.specialty}</Paragraph>
        <Paragraph>المحافظة: {item.governorate}</Paragraph>
        <Paragraph>السعر: {item.price} جنيه</Paragraph>
        <Paragraph>⭐ {item.review}/5</Paragraph>
      </Card.Content>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setSelectedDoctorId(item.id);
            setModalVisiblability(true);
          }}
        >
          <Text style={styles.buttonText}>احجز الموعد</Text>
        </TouchableOpacity>
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>حجز الموعد </Text>


              {/* استخدام selectedDoctorId هنا */}
              <BookingPage doctorId={selectedDoctorId} closeModal={closeModal} />

              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>إغلاق</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>

    </Card>
  );

  return (
    <ScrollView style={styles.container} nestedScrollEnabled={true} horizontal={false}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="ابحث باسم الدكتور أو التخصص"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterButton} onPress={() => openModal("specialty")}>
          <Text style={styles.filterText}>{specialtyFilter || "اختر التخصص"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => openModal("governorate")}>
          <Text style={styles.filterText}>{governorateFilter || "اختر المحافظة"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => openModal("rating")}>
          <Text style={styles.filterText}>
            {ratingFilter ? `${ratingFilter}+ ⭐` : "اختر التقييم"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => openModal("price")}>
          <Text style={styles.filterText}>
            {priceFilter ? ` أقل من ${priceFilter}` : "اختر السعر"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Doctors List */}
      <View style={{ flex: 1 }}>
        <FlatList
          scrollEnabled={false} // ✅ يمنع التضارب مع ScrollView
          data={filteredDoctors}
          renderItem={renderDoctor}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      </View>

      {/* Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Pressable style={styles.modalOption} onPress={() => selectOption("")}>
              <Text style={styles.modalOptionText}>
                {modalType === "price"
                  ? "كل الأسعار"
                  : modalType === "rating"
                    ? "كل التقييمات"
                    : "عرض الكل"}
              </Text>
            </Pressable>
            {getOptions().map((option, index) => (
              <Pressable key={index} style={styles.modalOption} onPress={() => selectOption(option)}>
                <Text style={styles.modalOptionText}>
                  {modalType === "price"
                    ? ` أقل من ${option}`
                    : modalType === "rating"
                      ? `${option}+ ⭐`
                      : option}
                </Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setModalVisible(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>إغلاق</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#fff",
  },
  searchContainer: {
    position: "relative",
    marginBottom: 16,
    backgroundColor: "#f0f4f7",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#333",
  },
  searchIcon: {
    marginLeft: 8,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: "#e0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 6,
    minWidth: "47%",
  },
  filterText: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 10,
    elevation: 4,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#08473a',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',   // لمنتصف الشاشة رأسيًا
    alignItems: 'center',       // لمنتصف الشاشة أفقيًا (ده المهم لمحور السينات)
  },

  modalSheet: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 20,
    width: '90%',
    maxHeight: "80%",
    elevation: 6,
    alignSelf: 'center',        // تأكيد إضافي للتمركز أفقيًا
  },
  modalHandle: {
    width: 40,
    height: 20,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 10,
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  modalClose: {
    marginTop: 10,
    alignItems: "center",
  },
  modalCloseText: {
    color: "#e74c3c",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DoctorsList;