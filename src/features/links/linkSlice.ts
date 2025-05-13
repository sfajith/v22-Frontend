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
    cleanLink(state) {
      state.loading = false;
      state.generated = false;
      state.error = null;
    },
  },
});

export const { startLink, createdLink, cleanLink } = linkSlice.actions;
export default linkSlice.reducer;
