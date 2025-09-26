import { createSlice } from "@reduxjs/toolkit";



const slicePage = createSlice({
    name: 'slicePage',
    initialState: {page: 'home'},
    reducers: {
        changePage: (state, action)=>{
            state.page = action.payload;
        }
    }
})



export default slicePage;
export const {changePage}= slicePage.actions;











