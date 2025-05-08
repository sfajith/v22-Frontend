import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./authTypes";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  collection: {
    totalCount: 0,
    nextCursor: null,
    isLoading: false,
    error: null,
    userLinks: [],
  },
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    startLoadCollection(state) {
      state.collection.isLoading = true;
      state.collection.error = null;
    },
    loadCollection(state, action) {
      state.collection.totalCount = action.payload.totalCount;
      state.collection.userLinks = action.payload.collection;
      state.collection.nextCursor = action.payload.nextCursor;
      state.collection.isLoading = false;
    },
    loadLocalCollection(state) {
      const local = localStorage.getItem("links");
      if (state.isAuthenticated === false && local) {
        state.collection.userLinks = JSON.parse(local);
      }
    },
    pushCollection(state, action) {
      state.collection.userLinks = [
        ...state.collection.userLinks,
        ...action.payload.collection,
      ];
      state.collection.nextCursor = action.payload.nextCursor;
      state.collection.isLoading = false;
    },
    addNewLink(state, action) {
      state.collection.userLinks.unshift(action.payload.link);
      state.collection.totalCount = state.collection.totalCount + 1;
    },
    loadCollectionFailure(state, action) {
      state.collection.isLoading = false;
      state.collection.error = action.payload;
    },

    deleteFromCollection(state, action) {
      state.collection.userLinks = state.collection.userLinks.filter(
        (link) => link.idLink !== action.payload.id
      );
      state.collection.totalCount = state.collection.totalCount - 1;
      if (state.isAuthenticated === false) {
        const local = localStorage.getItem("links");
        if (local) {
          const links = JSON.parse(local);
          state.collection.userLinks = links;
          state.collection.userLinks = state.collection.userLinks.filter(
            (link) => link.idLink !== action.payload.id
          );
          localStorage.setItem(
            "links",
            JSON.stringify(state.collection.userLinks)
          );
        }
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  startLoadCollection,
  loadCollection,
  loadCollectionFailure,
  deleteFromCollection,
  pushCollection,
  addNewLink,
  loadLocalCollection,
} = authSlice.actions;
export default authSlice.reducer;
