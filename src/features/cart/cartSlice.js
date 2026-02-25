import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: [],
    // cart: [
    //     {
    //         pizzaId: 12,
    //         name: "Mediterranean",
    //         quantity: 2,
    //         unitPrice: 16,
    //         totalPrice: 32,
    //     },
    // ],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem(currentState, action) {
            // payload = newItem
            currentState.cart.push(action.payload);
        },
        deleteItem(currentState, action) {
            // payload = pizzaId
            currentState.cart = currentState.cart.filter(
                (item) => item.pizzaId !== action.payload,
            );
        },
        increaseItemQuantity(currentState, action) {
            // payload = pizzaId
            const item = currentState.cart.find(
                (item) => item.pizzaId === action.payload,
            );
            item.quantity++;
            item.totalPrice = item.quantity * item.unitPrice;
        },
        decreaseItemQuantity(currentState, action) {
            // payload = pizzaId
            const item = currentState.cart.find(
                (item) => item.pizzaId === action.payload,
            );
            item.quantity--;
            item.totalPrice = item.quantity * item.unitPrice;
            if (item.quantity === 0)
                cartSlice.caseReducers.deleteItem(currentState, action);
        },
        clearCart(currentState) {
            currentState.cart = [];
        },
    },
});

export const {
    addItem,
    deleteItem,
    increaseItemQuantity,
    decreaseItemQuantity,
    clearCart,
} = cartSlice.actions; // This will give us Action Creators

export default cartSlice.reducer;

export const getCart = (store) => store.cart.cart;

export const getTotalCartQuantity = (store) =>
    store.cart.cart.reduce((acc, item) => acc + item.quantity, 0);

export const getTotalCartPrice = (store) =>
    store.cart.cart.reduce((acc, item) => acc + item.totalPrice, 0);

export const getCurrentQuantityById = (id) => (store) =>
    store.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
