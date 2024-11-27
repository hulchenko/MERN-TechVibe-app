import { CartInterface } from "../interfaces/cart.interface";

export const addDecimals = (num: number) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state: CartInterface) => {
  //Calculate items' price
  state.itemsPrice = addDecimals(state.cartItems.reduce((acc: any, item: any) => acc + item.price * item.qty, 0)); //0 is the accumulator's default value
  //Calculate shipping price (if over $100 - free, otherwise $10 for shipping)
  state.shippingPrice = addDecimals(Number(state.itemsPrice) > 100 ? 0 : 10);
  //Calculate tax price (AB 5%)
  state.taxPrice = addDecimals(Number((0.05 * Number(state.itemsPrice)).toFixed(2)));
  //Calculate total price
  state.totalPrice = (Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice)).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state)); //save state to local storage

  return state;
};
