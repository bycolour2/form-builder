import { arrayMove, arraySwap } from '@dnd-kit/sortable';
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { FieldType } from '~/pages/builder/ui';

export interface BuilderState {
  fields: FieldType[];
  editField: {
    field: FieldType | null;
    elementProps: any | null;
  };
}
const initialState: BuilderState = {
  fields: [],
  editField: {
    field: null,
    elementProps: null,
  },
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
    setFields: (state, action: PayloadAction<{ fields: FieldType[] }>) => {
      state.fields = action.payload.fields;
    },
    updateFieldIndex: (state, action: PayloadAction<{ id: Id; index: number }>) => {
      const currentIndex = state.fields.findIndex((f) => (f.id = action.payload.id));
      if (currentIndex < 0) {
        console.log(`builderSlice -> addField -> field with id ${action.payload.id} not found`);
        return;
      }
      // const fields = state.fields;
      // const currentState = current(state);
      // console.log('dropped id', action.payload.id);
    },
    removeField: (state, action: PayloadAction<{ id: Id }>) => {
      console.log(`builderSlice -> removeField -> field with id: ${action.payload.id} deleted`);

      state.fields = state.fields.filter((f) => f.id !== action.payload.id);
    },
    removeSpacers: (state) => {
      state.fields = state.fields.filter((f) => f.type !== 'spacer');
    },

    setEditField: (state, action: PayloadAction<{ id: Id; fieldProps?: any }>) => {
      const field = state.fields.find((f) => f.id === action.payload.id);
      if (!field) {
        console.log(`builderSlice -> setEditField -> field with id: ${action.payload.id} not found`);
        return;
      }
      state.editField.field = field;
      state.editField.elementProps = action.payload.fieldProps;
    },
    resetState: () => initialState,
  },
});

export const { addField, setFields, updateFieldIndex, removeField, removeSpacers, setEditField, resetState } =
  builderSlice.actions;

export const fieldsSelector = (state: RootState) => state.builder.fields;
export const editFieldSelector = (state: RootState) => state.builder.editField;

export default builderSlice.reducer;
