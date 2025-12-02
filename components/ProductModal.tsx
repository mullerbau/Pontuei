import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';

interface Product {
  id: number;
  name: string;
  price: string;
  image: any;
  description?: string;
  quantity?: number;
}

interface ProductModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ visible, product, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, removeItem, items } = useCart();

  useEffect(() => {
    if (product && product.quantity !== undefined) {
      setQuantity(product.quantity > 0 ? product.quantity : 1);
    } else {
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const currentItem = items.find(item => item.id === product.id);
  const currentQuantity = currentItem ? currentItem.quantity : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
      });
    }
    onClose();
    setQuantity(1);
  };

  const handleRemoveFromCart = () => {
    if (currentQuantity > 0) {
      removeItem(product.id);
      const newCurrentQuantity = currentQuantity - 1;
      if (newCurrentQuantity > 0) {
        setQuantity(newCurrentQuantity);
      } else {
        setQuantity(1);
      }
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>

          <Image source={product.image} style={styles.productImage} />
          
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{product.price}</Text>
          
          {product.description && (
            <Text style={styles.productDescription}>{product.description}</Text>
          )}

          {currentQuantity > 0 && (
            <View style={styles.currentQuantityContainer}>
              <Text style={styles.currentQuantityText}>
                Já no carrinho: {currentQuantity} {currentQuantity === 1 ? 'item' : 'itens'}
              </Text>
            </View>
          )}

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantidade:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
                <Ionicons name="remove" size={20} color="#ff3366" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
                <Ionicons name="add" size={20} color="#ff3366" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {currentQuantity > 0 && (
              <TouchableOpacity style={styles.removeButton} onPress={handleRemoveFromCart}>
                <Ionicons name="remove-circle" size={20} color="#fff" />
                <Text style={styles.removeButtonText}>Remover</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.addButton, currentQuantity > 0 && styles.addButtonSmall]} onPress={handleAddToCart}>
              <Text style={styles.addButtonText}>
                Adicionar ao Carrinho
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff3366',
    textAlign: 'center',
    marginBottom: 16,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  currentQuantityContainer: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  currentQuantityText: {
    fontSize: 14,
    color: '#ff3366',
    textAlign: 'center',
    fontWeight: '500',
  },
  quantityContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    backgroundColor: '#ff3366',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    flex: 1,
  },
  addButtonSmall: {
    flex: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});