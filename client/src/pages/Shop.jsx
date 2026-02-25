import React from 'react';
import { useGetProductsQuery } from '../store/api/productsApi';
import ProductList from '../components/products/ProductList';

const Shop = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;

  return <ProductList products={products} />;
};

export default Shop;
