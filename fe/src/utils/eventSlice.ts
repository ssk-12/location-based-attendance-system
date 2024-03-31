// Import the necessary functions from @reduxjs/toolkit
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the item in the state
type EventItem = {
  // Add properties here according to what your item should contain
  // For example, if each event item has an id and description, you could define it as:
  id: string;
  description: string;
};

// Define a type for the initial state
interface EventState {
  items: EventItem[];
}

// Define the initial state with the type EventState
const initialState: EventState = {
  items: [],
};

// Create the slice
const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    // Use PayloadAction to define the type of `action.payload`
    addItem: (state, action: PayloadAction<EventItem>) => {
      state.items.push(action.payload);
    },
    // You can add more reducers here if needed
  },
});

// Export the actions
export const { addItem } = eventSlice.actions;

// Export the reducer
export default eventSlice.reducer;
