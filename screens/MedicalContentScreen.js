import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';

const articles = [
  {
    id: 1,
    title: 'فوائد الزنجبيل للصحة العامة',
    summary: 'الزنجبيل من الأعشاب المفيدة التي تساهم في تقوية المناعة وتحسين الهضم وتقليل الالتهابات...',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtyLYI8kh0o_3uTbQBO5sg2pbyhtvbKQCWRw&s',
  },
  {
    id: 2,
    title: 'أسباب ارتفاع ضغط الدم',
    summary: 'ارتفاع ضغط الدم يمكن أن يكون نتيجة التوتر، السمنة، أو عوامل وراثية. التعرف على الأسباب يساعد في الوقاية...',
    image: 'https://cdn.altibbi.com/cdn/cache/1000x500/image/2022/09/06/8ee39047fb7b4eb86f180bfb6904724b.jpg.webp',
  },
  {
    id: 3,
    title: 'أهمية شرب الماء لصحة الجسم',
    summary: 'شرب الماء بانتظام يساهم في تنظيم حرارة الجسم وتحسين وظائف الكلى والدماغ...',
    image: 'https://cdn.altibbi.com/cdn/cache/xlarge/image/2022/08/31/a7797795ae309783863dc1ffb0501f6e.jpg.webp',
  },
  {
    id: 4,
    title: 'أعراض نقص فيتامين د',
    summary: 'من أشهر أعراض نقص فيتامين د التعب العام، ضعف العضلات، والم المفاصل، خاصة في فصل الشتاء...',
    image: 'https://www.ilajak.com/uploads/posts/07ab1210e8bda1024faa13fcba66ac91Q3P_450sPa.jpg',
  },
];

const ArticlesScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>مقالات طبية</Text>
      {articles.map(article => (
        <View key={article.id} style={styles.card}>
          <Image source={{ uri: article.image }} style={styles.image} />
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.summary}>{article.summary}</Text>
          <TouchableOpacity onPress={() => alert('تفاصيل المقال قريبًا...')}>
            <Text style={styles.readMore}>قراءة المزيد</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    direction: 'rtl',
    textAlign: 'right',
    alignItems: 'flex-start', 

  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    direction: 'rtl',
  },
  summary: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    direction: 'rtl',
    textAlign: 'left',

  },
  readMore: {
    color: '#007bff',
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

export default ArticlesScreen;
