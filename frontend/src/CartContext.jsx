import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // We initialize the state from localStorage so the cart doesn't disappear on refresh
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('booktrove_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Whenever the cart changes, we save it to localStorage
  useEffect(() => {
    localStorage.setItem('booktrove_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (liber) => {
  setCartItems((prevItems) => {
    const isItemInCart = prevItems.find((item) => item._id === liber._id);

    if (isItemInCart) {
      // Bllokimi: Nëse sasia në shportë arrin stokun, mos lejo shto tjetër
      if (isItemInCart.sasia >= liber.stoku) {
        alert(`Më vjen keq! Ka mbetur vetëm ${liber.stoku} kopje në stok.`);
        return prevItems;
      }
      return prevItems.map((item) =>
        item._id === liber._id ? { ...item, sasia: item.sasia + 1 } : item
      );
    }

    // Shtimi për herë të parë (vetëm nëse ka stok)
    if (liber.stoku > 0) {
      return [...prevItems, { ...liber, sasia: 1 }];
    } else {
      alert("Ky libër nuk ka më gjendje.");
      return prevItems;
    }
  });
};
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id 
          ? { ...item, sasia: Math.max(1, item.sasia + amount) } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart easily in other components
export const useCart = () => useContext(CartContext);