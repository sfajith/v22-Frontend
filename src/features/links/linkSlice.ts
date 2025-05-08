import { createSlice } from "@reduxjs/toolkit";
import { LinkState } from "./linkTypes";

const initialState: LinkState = {
  link: [
    {
      idLink: "",
      originalUrl: "",
      shorter: "",
    },
  ],
  loading: false,
  generated: false,
  error: null,
};

const linkSlice = createSlice({
  name: "link",
  initialState,
  reducers: {
    startLink(state) {
      state.loading = true;
      state.error = null;
      state.generated = true;
    },
    createdLink(state) {
      state.loading = false;

      const linkArray = localStorage.getItem("links");
      if (linkArray) {
        state.link = JSON.parse(linkArray).reverse();
      }
    },
    errorLink(state, action) {
      state.loading = false;
      state.generated = false;
      state.error = action.payload;
    },
  },
});

export const { startLink, createdLink, errorLink } = linkSlice.actions;
export default linkSlice.reducer;
