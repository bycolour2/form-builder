import { useEffect, useRef, useState } from 'react';
import { Sidebar, SidebarField } from './Sidebar';
import {
  Active,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  Over,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Canvas, Field } from './Canvas';
import { FieldType, StableFieldType } from './fields';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useImmer } from 'use-immer';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { addField, fieldsSelector } from '~/pages/builder';

function getData(prop: Active | Over | null) {
  return prop?.data?.current ?? {};
}

function createSpacer({ id }: { id: Id }) {
  return {
    id,
    type: 'spacer',
    title: 'spacer',
  };
}

export const Builder = () => {
  const dispatch = useAppDispatch();
  const storeFields = useAppSelector(fieldsSelector);
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });

  console.log(storeFields);

  const sensors = useSensors(mouseSensor);

  const [sidebarFieldsRegenKey, setSidebarFieldsRegenKey] = useState(Date.now());

  const spacerInsertedRef = useRef<boolean>(false);
  const currentDragFieldRef = useRef<FieldType | null>(null);

  const [activeSidebarField, setActiveSidebarField] = useState<StableFieldType | null>(null); // only for fields from the sidebar
  const [activeField, setActiveField] = useState<FieldType | null>(null); // only for fields that are in the form.
  const [data, updateData] = useImmer<{ fields: FieldType[] }>({
    fields: storeFields,
  });

  const cleanUp = () => {
    setActiveSidebarField(null);
    setActiveField(null);
    spacerInsertedRef.current = false;
    currentDragFieldRef.current = null;
  };

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = getData(active);

    // This is where the cloning starts.
    // We set up a ref to the field we're dragging
    // from the sidebar so that we can finish the clone
    // in the onDragEnd handler.
    if (activeData && activeData.fromSidebar) {
      const { field } = activeData;
      const { type } = field;
      setActiveSidebarField(field);

      // Create a new field that'll be added to the fields array
      // if we drag it over the canvas.
      currentDragFieldRef.current = {
        id: active.id,
        type,
        name: `${type}${fields.length + 1}`,
        parent: null,
      };
      return;
    }

    // We aren't creating a new element so go ahead and just insert the spacer
    // since this field already belongs to the canvas.
    const { index, field } = activeData;
    setActiveField(field);
    currentDragFieldRef.current = field;
    updateData((draft) => {
      draft.fields.splice(index, 1, createSpacer({ id: active.id }));
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const activeData = getData(active);

    // Once we detect that a sidebar field is being moved over the canvas
    // we create the spacer using the sidebar fields id with a spacer suffix and add into the
    // fields array so that it'll be rendered on the canvas.

    // 🐑 CLONING 🐑
    // This is where the clone occurs. We're taking the id that was assigned to
    // sidebar field and reusing it for the spacer that we insert to the canvas.
    if (activeData && activeData.fromSidebar) {
      const overData = getData(over);

      if (!spacerInsertedRef.current) {
        const spacer = createSpacer({ id: active.id + '-spacer' });

        updateData((draft) => {
          if (!draft.fields.length) {
            draft.fields.push(spacer);
          } else {
            const nextIndex = overData.index > -1 ? overData.index : draft.fields.length;

            draft.fields.splice(nextIndex, 0, spacer);
          }
          spacerInsertedRef.current = true;
        });
        // spacerInsertedRef.current = true;
      } else if (!over) {
        // This solves the issue where you could have a spacer handing out in the canvas if you drag
        // a sidebar item on and then off
        updateData((draft) => {
          draft.fields = draft.fields.filter((f) => f.type !== 'spacer');
        });
        spacerInsertedRef.current = false;
      } else {
        // Since we're still technically dragging the sidebar draggable and not one of the sortable draggables
        // we need to make sure we're updating the spacer position to reflect where our drop will occur.
        // We find the spacer and then swap it with the over skipping the op if the two indexes are the same
        updateData((draft) => {
          const spacerIndex = draft.fields.findIndex((f) => f.id === active.id + '-spacer');

          const nextIndex = overData.index > -1 ? overData.index : draft.fields.length - 1;

          if (nextIndex === spacerIndex) {
            return;
          }

          draft.fields = arrayMove(draft.fields, spacerIndex, overData.index);
        });
      }
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { over } = event;

    // We dropped outside of the over so clean up so we can start fresh.
    if (!over) {
      cleanUp();
      updateData((draft) => {
        draft.fields = draft.fields.filter((f) => f.type !== 'spacer');
      });
      return;
    }

    // This is where we commit the clone.
    // We take the field from the this ref and replace the spacer we inserted.
    // Since the ref just holds a reference to a field that the context is aware of
    // we just swap out the spacer with the referenced field.
    const nextField = currentDragFieldRef.current;

    const overData = getData(over);

    if (nextField) {
      const spacerIndex = data.fields.findIndex((f) => f.type === 'spacer');
      updateData((draft) => {
        draft.fields.splice(spacerIndex, 1, nextField);
        draft.fields = arrayMove(draft.fields, spacerIndex, overData.index || 0);
      });
      dispatch(addField({ field: nextField, index: spacerIndex }));
      // dispatch(increment({ field: nextField, index: spacerIndex }));
    }

    setSidebarFieldsRegenKey(Date.now());
    cleanUp();
  };

  const { fields } = data;

  return (
    <div className="flex h-screen w-screen flex-row">
      <DndContext onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd} sensors={sensors}>
        <Sidebar fieldsRegKey={sidebarFieldsRegenKey} />
        <SortableContext strategy={verticalListSortingStrategy} items={fields.map((f) => f.id)}>
          <Canvas fields={fields} />
        </SortableContext>
        <DragOverlay dropAnimation={null}>
          {activeSidebarField ? <SidebarField overlay field={activeSidebarField} /> : null}
          {activeField ? <Field overlay field={activeField} /> : null}
        </DragOverlay>
      </DndContext>
      <div className="flex w-[250px] flex-col border-l border-black">
        <div className="border-b border-black px-3.5 py-2.5 text-center">Properties</div>
      </div>
    </div>
  );
};