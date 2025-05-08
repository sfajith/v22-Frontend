import { createSlice } from "@reduxjs/toolkit";
import { Ui } from "./uiTypes";

const initialState: Ui = {
  isRegistered: false,
  isLoading: false,
  error: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    startRegister(state) {
      state.isLoading = true;
      state.error = null;
    },
    finishRegister(state) {
      state.isLoading = false;
      state.isRegistered = true;
    },
    errorRegister(state, action) {
      state.isLoading = false;
      state.isRegistered = false;
      state.error = action.payload;
    },
  },
});

export const { startRegister, finishRegister, errorRegister } = uiSlice.actions;
export default uiSlice.reducer;
