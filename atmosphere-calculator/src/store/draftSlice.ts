import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Gas } from '../types';

interface DraftItem {
  gas: Gas;
  quantity: number;
}

interface DraftState {
  items: DraftItem[];
}

const initialState: DraftState = {
  items: [],
};

const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Gas>) => {
      const existingItem = state.items.find(item => item.gas.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ gas: action.payload, quantity: 1 });
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.gas.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ gasId: number; quantity: number }>) => {
      const item = state.items.find(item => item.gas.id === action.payload.gasId);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    clearDraft: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearDraft } = draftSlice.actions;
export default draftSlice.reducer;
