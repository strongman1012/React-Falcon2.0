import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  viewingUserData: {},
  currentModuleSchema: {},
  currentModuleSchemaLoading: false,
  fieldPluginTable: null,
  fieldPluginTableLoading: true,
  editFormSaved: true,
  lookupFieldAdditionalOptions: {}, // { fieldKey: [{Option1}, {Option2},...], ...}
  currentMemberMenuSchema: {}, //member menu schema {"menu":{},....}
  currentPointMenuSchema: {}, //member menu schema {"menu":{},....}
  currentTransactionMenuSchema: {}, //transaction menu schema {"menu":{},....}
  currentPromotionsMenuSchema: {},
  currentTransactionPromotionsMenuSchema: {}
};

/* Store overall app current(In view) data */
const currentDataSlice = createSlice({
  name: 'currentData',
  initialState,
  reducers: {
    setCurrentData(currentData, { payload }) {
      return { ...currentData, ...payload };
    },
    setMemberMenuData(currentData, { payload }) {
      return { ...currentData, ...payload };
    },
    setTransactionMenuData(currentData, { payload }) {
      return { ...currentData, ...payload };
    },
    setPointMenuData(currentData, { payload }) {
      return { ...currentData, ...payload };
    },
    setPromotionsMenuData(currentData, { payload }) {
      return { ...currentData, ...payload };
    },
    setTransactionPromotionsMenuData(currentData, { payload }) {
      return { ...currentData, ...payload };
    }
  }
});

export const {
  setCurrentData,
  setMemberMenuData,
  setTransactionMenuData,
  setPromotionsMenuData,
  setTransactionPromotionsMenuData,
  setPointMenuData
} = currentDataSlice.actions;

export default currentDataSlice.reducer;
