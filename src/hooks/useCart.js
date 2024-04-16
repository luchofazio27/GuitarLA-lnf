import { useEffect, useState, useMemo } from "react";
import { db } from "../data/db";

export const useCart = () => {

    const initialCart = () => { // Iniciamos el carrito
        const localStorageCart = localStorage.getItem('cart') // Instanciamos lo que tenemos en el almacenamiento local del navegador
        return localStorageCart ? JSON.parse(localStorageCart) : [] // Si existe lo pasamos a un arreglo o seteamos el arreglo vacio
      }
      const [data] = useState(db);
      const [cart, setCart] = useState(initialCart)
    
      const MAX_ITEMS = 5
      const MIN_ITEMS = 1
    
      useEffect(() => { // Cada vez que el carrito sufre modificaciones, ejecuta el useEffect
        localStorage.setItem('cart', JSON.stringify(cart)) // Toma el carrito en su primer parametro y lo convierte en una cadena JSON
      }, [cart])
    
      function addToCart(item) { // funcion para agregar items al carrito de compras
        const itemExists = cart.findIndex(guitar => guitar.id === item.id) // busca el item agregado si ya existe en el carrito
        if(itemExists >= 0) { // Si existe en el carrito
          if(cart[itemExists].quantity >= MAX_ITEMS) return // Si en su posicion actual la cantidad es mayor a MAX_ITEMS se detiene el codigo y deja de sumar
          const updatedCart = [...cart] // Instanciamos una copia del carrito para no modificar el state original
          updatedCart[itemExists].quantity++ // Le suma uno al item existente
          setCart(updatedCart) // Setea el state
        } else { // Si el item no existe en el carrito lo agrega al carrito
          item.quantity = 1
          setCart([...cart, item])
        }
      }
    
      function removeFromCart(id) { // Funcion para eliminar un item
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
      }
    
      function increaseQuantity(id) { // Funcion para incrementar la cantidad sobre un item en el carrito
        const updatedCart = cart.map( item => { // el map retorna un nuevo Arreglo
          if(item.id === id && item.quantity < MAX_ITEMS) { //Si el item id es igual al id que le estamos pasando
            return {
              ...item, // Hacemos una copia del item
            quantity: item.quantity + 1 // Le sumamos uno a su cantidad
            }
          }
          return item
        })
        setCart(updatedCart)
      }
    
      function decreaseQuantity(id) { // Funcion para decrementar la cantidad sobre un item en el carrito
        const updatedCart = cart.map( item => { // el map retorna un nuevo Arreglo
          if(item.id === id && item.quantity > MIN_ITEMS) { //Si el item id es igual al id que le estamos pasando
            return {
              ...item, // Hacemos una copia del item
            quantity: item.quantity - 1 // Le restamos uno a su cantidad
            }
          }
          return item
        })
        setCart(updatedCart)
      }
    
      function clearCart() {
        setCart([])
      }

      //State derivado
    const isEmpty = useMemo( () => cart.length === 0, [cart]) // Instanciamos el carrito vacio, utilizamos useMemo para mejorar el performance del codigo y el mismo se ejecuta cuando cart sufre modificaciones
    const cartTotal = useMemo( () => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart]) // Calcula el total a pagar


    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}


