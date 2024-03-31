import { createSlice } from "@reduxjs/toolkit";


const eventSlice = createSlice({
    name: "event",
    initialState: {
        items: []
    },
    reducers: {
        addItem: (state, action) => {
            state.items.push(action.payload)
        }
    }
});

export const { addItem } = eventSlice.actions;

export default eventSlice.reducer;