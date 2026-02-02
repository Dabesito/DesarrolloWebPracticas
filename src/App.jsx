import { useState, useEffect } from "react"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { db } from "./data/db"
import { Guitar } from "./components/Guitar"

const App = () => {

  function initialCart(){
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  }

  const [data, setData] = useState(db);
  const [cart, setCart] = useState(initialCart);
  
  const MAX_ITEMS = 5; 
  const MIN_ITEMS = 1; 

  useEffect(()=>{
    localStorage.setItem('cart', JSON.stringify(cart));
  },[cart])
  
  function addtoCart(item) {
    const itemIndex = cart.findIndex((guitar) => item.id === guitar.id);
    if (itemIndex === -1) {
      setCart([...cart, { ...item, quantity: 1 }]);
    } else {
      if(cart[itemIndex].quantity >= MAX_ITEMS) return; 
      const updatedCart = [...cart];
      updatedCart[itemIndex].quantity++;
      setCart(updatedCart);
    }
  }

  
  function removeFromCart(id) {
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id));
  }

  
  function increaseQuantity(id) {
    const updatedCart = cart.map(item => {
      if(item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item, 
          quantity: item.quantity + 1
        }
      }
      return item;
    })
    setCart(updatedCart);
  }

  
  function decreaseQuantity(id) {
    const updatedCart = cart.map(item => {
      if(item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item, 
          quantity: item.quantity - 1
        }
      }
      return item;
    })
    setCart(updatedCart);
  }

  
  function clearCart() {
    setCart([]);
  }

  function calculateTotal(){
    let total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    return total;
  }

  return (
    <>
        {/* AQUI PASAMOS LAS NUEVAS FUNCIONES AL HEADER */}
        <Header 
          cart={cart} 
          total={calculateTotal()} 
          removeFromCart={removeFromCart}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          clearCart={clearCart}
        />

        <main className="container-xl mt-5">
          <h2 className="text-center">Nuestra Colección</h2>
          
          <div className="row mt-5">
            {data.map((guitar) => (
              <Guitar 
                key={guitar.id} 
                guitar={guitar}
                addtoCart={addtoCart} 
              />
            ))}
          </div>
        </main>

        <Footer />
    </>
  )
}

export default App

