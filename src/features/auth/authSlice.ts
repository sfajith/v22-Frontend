import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./authTypes";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  accessToken: null,
  loading: false,
  collection: {
    totalCount: 0,
    nextCursor: null,
    isLoading: false,
    error: null,
    userLinks: [],
  },
  error: null,
  success: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    globalError(state, action) {
      state.error = action.payload;
    },
    disableError(state) {
      state.error = null;
    },
    globalSuccess(state, action) {
      state.success = action.payload;
    },
    disableSuccess(state) {
      state.success = null;
    },
    globalLoading(state) {
      state.loading = true;
    },
    disableLoading(state) {
      state.loading = false;
    },
    overWriteAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
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
  globalError,
  disableError,
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
  globalSuccess,
  disableSuccess,
  globalLoading,
  disableLoading,
  overWriteAccessToken,
} = authSlice.actions;
export default authSlice.reducer;
