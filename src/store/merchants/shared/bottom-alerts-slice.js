import { createSlice } from "@reduxjs/toolkit";
import store from "../store";

const initialState = {
  alert: null,
};

const bottomAlerts = createSlice({
  name: "bottomAlerts",
  initialState,
  reducers: {
    showAlertSuccess(state, action) {
      const { message } = action.payload;
      const timeOut = action.timeOut ?? 8000;

      state.alert = {
        type: "success",
        message,
      };

      setTimeout(() => {
        store.dispatch(clearAlerts());
      }, timeOut);
    },
    showAlertWarning(state, action) {
      const { message } = action.payload;
      const timeOut = action.timeOut ?? 8000;

      state.alert = {
        type: "warning",
        message,
      };

      setTimeout(() => {
        store.dispatch(clearAlerts());
      }, timeOut);
    },
    clearAlerts(state) {
      state.alert = null;
    },
  },
});

export default bottomAlerts.reducer;

export const { showAlertSuccess, showAlertWarning, clearAlerts } =
  bottomAlerts.actions;
