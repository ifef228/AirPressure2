import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  nameFilter: string;
  formulaFilter: string;
}

const initialState: FiltersState = {
  nameFilter: '',
  formulaFilter: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setNameFilter: (state, action: PayloadAction<string>) => {
      state.nameFilter = action.payload;
    },
    setFormulaFilter: (state, action: PayloadAction<string>) => {
      state.formulaFilter = action.payload;
    },
    resetFilters: (state) => {
      state.nameFilter = '';
      state.formulaFilter = '';
    },
  },
});

export const { setNameFilter, setFormulaFilter, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
