import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    login: (state, actions) => {
      state = actions.payload;
      return state;
    },
    logout: () => {
      return null;
    },
    // Add new reducer for updating user
    updateUser: (state, actions) => {
      state = actions.payload;
      return state;
    }
  },
});

// Export the new action along with existing ones
export const { login, logout, updateUser } = counterSlice.actions;
export const selectUser = (store) => store.user;
export default counterSlice.reducer;
