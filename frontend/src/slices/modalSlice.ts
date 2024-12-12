import { createSlice } from "@reduxjs/toolkit";
import { ModalInterface } from "../interfaces/modal.interface";

const initialState: ModalInterface = { open: false, confirm: false, type: "", id: "" };

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { payload } = action; // {type, payload}
      state.open = true;
      state.confirm = false;
      state.type = payload?.type || "";
      state.id = payload?.id || "";
    },
    confirmModal: (state) => {
      state.open = false;
      state.confirm = true;
    },
    cancelModal: (state) => {
      state.open = false;
      state.confirm = false;
    },
  },
});

export const { openModal, confirmModal, cancelModal } = modalSlice.actions;

export default modalSlice.reducer;
