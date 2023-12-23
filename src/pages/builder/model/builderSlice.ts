import { arrayMove, arraySwap } from '@dnd-kit/sortable';
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { FieldType } from '~/pages/builder/ui';
import { FieldDescription } from '~/pages/builder/ui';
import { FieldDescriptionTest } from '~/pages/builder/ui/fields';

export interface BuilderState {
  fields: {
    fieldValue: FieldType;
    fieldProps: FieldDescriptionTest['availableProps'];
  }[];
  editField: {
    field: FieldType | null;
    elementProps: FieldDescriptionTest['availableProps'] | null;
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
    addField: (
      state,
      action: PayloadAction<{
        field: {
          fieldValue: FieldType;
          fieldProps: FieldDescriptionTest['availableProps'];
        };
        index: number;
      }>,
    ) => {
      if (state.fields.find((f) => f.fieldValue.id === action.payload.field.fieldValue.id)) {
        console.log(`builderSlice -> addField -> already have this field`);
        return;
      }
      state.fields.splice(action.payload.index, 0, action.payload.field);
    },
    setFields: (
      state,
      action: PayloadAction<{
        fields: {
          fieldValue: FieldType;
          fieldProps: FieldDescriptionTest['availableProps'];
        }[];
      }>,
    ) => {
      state.fields = action.payload.fields;
    },
    updateFieldIndex: (state, action: PayloadAction<{ id: Id; index: number }>) => {
      const currentIndex = state.fields.findIndex((f) => (f.fieldValue.id = action.payload.id));
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

      state.fields = state.fields.filter((f) => f.fieldValue.id !== action.payload.id);
    },
    removeSpacers: (state) => {
      state.fields = state.fields.filter((f) => f.fieldValue.type !== 'spacer');
    },
    setEditField: (
      state,
      action: PayloadAction<{
        id: Id;
        fieldProps?: FieldDescriptionTest['availableProps'];
      }>,
    ) => {
      const field = state.fields.find((f) => f.fieldValue.id === action.payload.id);
      if (!field) {
        console.log(
          `builderSlice -> setEditField -> field with id: ${action.payload.id} not found`,
        );
        return;
      }
      state.editField.field = field.fieldValue;
      state.editField.elementProps = field.fieldProps;
    },
    updateEditFieldProp: (
      state,
      action: PayloadAction<{
        fieldId: Id;
        key: string;
        value: string | number | boolean | undefined;
      }>,
    ) => {
      state.editField.elementProps = {
        ...state.editField.elementProps,
        [action.payload.key]: {
          ...state.editField.elementProps,
          defaultValue: action.payload.value,
        },
      };
    },
    saveEditFieldProps: (state) => {
      const fieldIndex = state.fields.findIndex(
        (f) => f.fieldValue.id === state.editField.field?.id,
      );
      if (!state.editField.elementProps) {
        console.log(
          `builderSlice -> saveEditFieldProps -> error while saving props of editing field. Id is ${state.editField.field?.id}`,
        );

        return;
      }
      state.fields[fieldIndex].fieldProps = state.editField.elementProps;
    },
    resetEditField: (state) => {
      state.editField = initialState.editField;
    },
    resetState: () => initialState,
  },
});

export const {
  addField,
  setFields,
  updateFieldIndex,
  removeField,
  removeSpacers,
  setEditField,
  updateEditFieldProp,
  saveEditFieldProps,
  resetEditField,
  resetState,
} = builderSlice.actions;

export const fieldsSelector = (state: RootState) => state.builder.fields;
export const fieldSelector = (id: Id) => (state: RootState) =>
  state.builder.fields.find((f) => f.fieldValue.id === id);
export const editFieldSelector = (state: RootState) => state.builder.editField;

export default builderSlice.reducer;
