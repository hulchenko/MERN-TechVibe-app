import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : { cartItems: [] };

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => { //function
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);
            if (existItem) {
                state.cartItems = state.cartItems.map((x) => x._id === existItem._id ? item : x);
            } else {
                state.cartItems = [...state.cartItems];
            }

            //Calculate items' price
            state.itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0); //0 is the accumulator's default value
            //Calculate shipping price (if over $100 - free, otherwise $10 for shipping)
            state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;
            //Calculate tax price (AB 5%)
            state.taxPrice = Number((0.05 * state.itemsPrice).toFixed(2));
            //Calculate total price
            state.totalPrice = (
                Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice)
            ).toFixed(2);

            localStorage.setItem('cart', JSON.stringify(state)); //save state to local storage
        }
    }
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;