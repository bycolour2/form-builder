import { arrayMove } from '@dnd-kit/sortable';
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
      if (state.fields.find((f) => f.id === action.payload.field.id)) {
        console.log(`builderSlice -> addField -> already have this field`);
        return;
      }
      state.fields.splice(action.payload.index, 0, action.payload.field);
    },
    // replaceField: (state, action: PayloadAction<{ field: FieldType; index: number }>) => {},
    updateFieldIndex: (state, action: PayloadAction<{ id: Id; index: number }>) => {
      const currentIndex = state.fields.findIndex((f) => (f.id = action.payload.id));
      if (currentIndex < 0) {
        console.log(`builderSlice -> addField -> field with id ${action.payload.id} not found`);
        return;
      }
      state.fields = arrayMove(state.fields, currentIndex, action.payload.index);
    },
    removeField: (state, action: PayloadAction<{ id: Id }>) => {
      console.log(`builderSlice -> removeField -> field with id: ${action.payload.id} deleted`);

      state.fields = state.fields.filter((f) => f.id !== action.payload.id);
    },
    removeSpacers: (state) => {
      state.fields = state.fields.filter((f) => f.type !== 'spacer');
    },
    resetState: () => initialState,
  },
});

export const { addField, updateFieldIndex, removeField, removeSpacers, resetState } = builderSlice.actions;

export const fieldsSelector = (state: RootState) => state.builder.fields;

export default builderSlice.reducer;
