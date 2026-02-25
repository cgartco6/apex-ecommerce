import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery, useGetProductsQuery } from '../../store/api/productsApi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useGetProductByIdQuery(id);
  const { data: allProducts } = useGetProductsQuery();
  const dispatch = useDispatch();

  if (isLoading) return <div>Loading...</div>;

  const addToCartHandler = () => {
    dispatch(addToCart({ id: product._id, name: product.name, price: product.price, image: product.image, quantity: 1 }));
  };

  // AI-like recommendation: products in same category (excluding current)
  const recommendations = allProducts?.filter(p => p.category === product.category && p._id !== product._id).slice(0, 3);

  return (
    <div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <img src={product.image} alt={product.name} style={{ width: '400px' }} />
        <div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          <p>Brand: {product.brand}</p>
          <p>In Stock: {product.countInStock}</p>
          <button className="btn-primary" onClick={addToCartHandler}>Add to Cart</button>
        </div>
      </div>

      {recommendations && recommendations.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2>You might also like</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {recommendations.map((rec) => (
              <div key={rec._id}>
                <img src={rec.image} alt={rec.name} style={{ width: '100%' }} />
                <h4>{rec.name}</h4>
                <p>${rec.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
