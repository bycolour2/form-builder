import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldType } from '~/pages/builder/ui';

export interface BuilderState {
  fields: FieldType[];
}
const initialState: BuilderState = {
  fields: [],
};

export const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<{ field: FieldType; index: number }>) => {
      // state.fields.push(action.payload);
      state.fields.splice(action.payload.index, 0, action.payload.field);
    },
    removeField: (state, action: PayloadAction<{ id: Id }>) => {},
    resetState: () => initialState,
  },
});

export const { addField } = builderSlice.actions;

export const fieldsSelector = (state: RootState) => state.builder.fields;

export default builderSlice.reducer;
