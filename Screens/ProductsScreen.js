import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { CartContext } from '../components/CartContext'; 
import { useContext } from 'react';
import Toast from 'react-native-root-toast';


const { width } = Dimensions.get('window');

export default function ProductScreen({ route, navigation }) {
  const { product } = route.params;
  const [selectedSize, setSelectedSize] = useState('M');
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const [reviewText, setReviewText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const handleReviewSubmit = () => {
    if (reviewText.trim() === '' || userRating === 0) {
      Alert.alert('Please add a review and select a rating.');
      return;
    }

    const newReview = { text: reviewText, rating: userRating };
    setReviews([newReview, ...reviews]);
    setReviewText('');
    setUserRating(0);
  };

  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      size: selectedSize,
      quantity: 1,
    };

    addToCart(productToAdd);

    Toast.show(`${product.name} added to cart`, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER,
      backgroundColor: '#567c8d',
      textColor: '#000',
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      <Image source={product.image} style={styles.image} resizeMode="contain" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.brand}>Vigilante</Text>
        <Text style={styles.name}>{product.name}</Text>

        <View style={styles.ratingRow}>
          <AntDesign name="star" size={16} color="#FFD700" />
          <AntDesign name="star" size={16} color="#FFD700" />
          <AntDesign name="star" size={16} color="#FFD700" />
          <AntDesign name="star" size={16} color="#FFD700" />
          <AntDesign name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>({product.rating})</Text>
        </View>

        <Text style={styles.price}>R{product.price}</Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          This is the Discription of the Product It is like this for now so i will Change it later.
        </Text>

        <Text style={styles.sectionTitle}>Size</Text>
        <View style={styles.sizeContainer}>
          {sizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeOption,
                selectedSize === size && styles.sizeSelected,
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text
                style={[
                  styles.sizeText,
                  selectedSize === size && styles.sizeTextSelected,
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Leave a Review</Text>

        <View style={styles.ratingRow}>
          <Text style={{ marginRight: 8 }}>Your Rating:</Text>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
              <AntDesign
                name="star"
                size={20}
                color={userRating >= star ? '#FFD700' : '#ccc'}
              />
            </TouchableOpacity>
          ))}
        </View>

          <TextInput
          placeholder="Write your review..."
          value={reviewText}
          onChangeText={setReviewText}
          style={styles.reviewInput}
        />


        <TouchableOpacity style={styles.submitReview} onPress={handleReviewSubmit}>
          <Text style={styles.submitReviewText}>Submit Review</Text>
        </TouchableOpacity>

        {reviews.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {reviews.map((rev, index) => (
              <View key={index} style={styles.reviewCard}>
                <View style={styles.ratingRow}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <AntDesign key={i} name="star" size={16} color="#FFD700" />
                  ))}
                </View>
                <Text style={styles.reviewText}>{rev.text}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addToCart} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: width,
    height: 300,
    marginTop: 80,
  },
  content: {
    padding: 20,
    paddingBottom: 140,
  },
  brand: {
    fontSize: 13,
    color: '#888',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
    flexWrap: 'wrap',
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#777',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sizeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  sizeOption: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sizeSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  sizeText: {
    fontSize: 14,
    color: '#000',
  },
  sizeTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
    marginTop: 8,
  },
  submitReview: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitReviewText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  reviewText: {
    fontSize: 13,
    color: '#333',
    marginTop: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  addToCart: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
