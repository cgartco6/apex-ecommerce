import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(addToCart({ id: product._id, name: product.name, price: product.price, image: product.image, quantity: 1 }));
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem' }}>
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <h3>{product.name}</h3>
        <p>${product.price}</p>
      </Link>
      <button className="btn-primary" onClick={addToCartHandler}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
