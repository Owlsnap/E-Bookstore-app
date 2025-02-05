import { createSlice } from '@reduxjs/toolkit'
import Swal from 'sweetalert2';



const initialState = {
    cartItems: [],
}


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.cartItems.find(item => item._id === action.payload._id);
            if(!existingItem) {
                state.cartItems.push(action.payload);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Item added to cart",
                    width: "25em",
                    showConfirmButton: false,
                    timer: 1500
                  });
            } else {
                Swal.fire({
                    title: "Already in cart",
                    //text: "Item is already in cart",
                    icon: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    //confirmButtonText: "Yes, add it!", // add functionality to add it
                   });
                //.then((result) => {
                //     if (result.isConfirmed) {
                //       Swal.fire({
                //         title: "Deleted!",
                //         text: "Your file has been deleted.",
                //         icon: "success"
                //       });
                //     }
                //   });
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item._id !== action.payload._id);
        },
        clearCart: (state) => {
            if (state.cartItems.length > 0) {
            state.cartItems = [];
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "Cart cleared",
              });
            }
        }
    }
  });

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;