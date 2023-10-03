import { createSlice } from '@reduxjs/toolkit';
import vars from 'utils/vars';

const initialState = {
  initialCall: true,
  loading: true,
  data: [],
  dataResObj: {},
  columnDefs: [],
  paginationPageSize: vars.PAGINATION_PAGE_SIZE_OPTIONS[0], // limit
  paginationCurrentPage: 1, // page
  selectedTableRowKeys: [],
  searchText: '',
  dateRange: ['', ''],
  textFilterField: 'all',
  dateFilterField: '',
  processing: false,
  sortByQuery: ''
};

/* Store /viewlist data */
const viewlistSlice = createSlice({
  name: 'viewlistState',
  initialState,
  reducers: {
    updateViewlistState(current, { payload }) {
      return { ...current, initialCall: false, ...payload };
    },
    setViewlistLoadingState(current, { payload }) {
      return { ...current, loading: payload };
    },
    resetViewlistState(_, { payload = {} }) {
      return { ...initialState, ...payload };
    }
  }
});

export const {
  updateViewlistState,
  setViewlistLoadingState,
  resetViewlistState
} = viewlistSlice.actions;

export default viewlistSlice.reducer;
