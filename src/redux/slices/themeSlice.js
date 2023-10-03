import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarShow: true,
  headerShow: true,
  footerShow: true,
  pageLayout: null,
  contentLayout: null,
  activeTemplate: null,
  currentModule: '',
  currentPage: '',
  currentTitle: '',
  currentDataID: '',
  viewEditContainerClass: ''
};

/* Store schema level theme config provided by api */
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeData(theme, { payload }) {
      return { ...theme, ...payload };
    }
  }
});

export const { setThemeData } = themeSlice.actions;

export default themeSlice.reducer;
