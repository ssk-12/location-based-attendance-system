import { configureStore } from "@reduxjs/toolkit";
import  eventReducer  from "./eventSlice";

const appStore = configureStore({
    reducer: {
        event: eventReducer,
    }
});

export default appStore;