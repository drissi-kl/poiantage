import { configureStore } from "@reduxjs/toolkit";
import slicePage from "./SlicePage";


const store = configureStore({
    reducer: {currentPage: slicePage.reducer}
})

export default store;
