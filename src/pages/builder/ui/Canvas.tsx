import { cn, useClickOutside } from '~/shared/lib';
import { FieldType, renderersD, renderersDTest } from './fields';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';
import { Button } from '~/shared/ui';
import { Edit, Trash } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import {
  editFieldSelector,
  fieldSelector,
  removeField,
  resetEditField,
  setEditField,
} from '~/pages/builder';
import { useHover } from 'usehooks-ts';

const getRenderer = (type: string) => {
  if (type === 'spacer') {
    return () => (
      <div className={cn('h-20 rounded-md bg-black px-3 py-2.5 text-red-500 opacity-40')}>
        spacer
      </div>
    );
  }

  return renderersDTest[type].renderer || (() => <div>No renderer found for {type}</div>);
};

type ElementOverlayProps = { field: FieldType };

const ElementOverlay = ({ field }: ElementOverlayProps) => {
  const dispatch = useAppDispatch();
  const overlayRef = useRef(null);

  const editFieldInfo = useAppSelector(editFieldSelector);

  const isElementEditing = editFieldInfo.field?.id === field.id;

  return (
    <div
      ref={overlayRef}
      className={cn(
        'absolute h-full w-full rounded-sm border-4 ',
        isElementEditing ? 'border-blue-600' : 'border-blue-400',
      )}
    >
      <div className="relative">
        <div
          className={cn(
            'absolute right-0 top-0 rounded-bl-md pb-1 pl-1',
            isElementEditing ? 'bg-blue-600' : 'bg-blue-400',
          )}
        >
          <Button
            variant={'ghost'}
            size={'icon'}
            onClick={() =>
              dispatch(
                setEditField({
                  id: field.id,
                  fieldProps: renderersDTest[field.type].availableProps,
                }),
              )
            }
            className={cn(isElementEditing ? 'hover:bg-blue-500' : 'hover:bg-blue-600')}
          >
            <Edit className="h-4 w-4 text-white" />
          </Button>
          <Button
            variant={'ghost'}
            size={'icon'}
            onClick={() => {
              dispatch(removeField({ id: field.id }));
              dispatch(resetEditField());
            }}
            className={cn(isElementEditing ? 'hover:bg-blue-500' : 'hover:bg-blue-600')}
          >
            <Trash className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};

type FieldOverlayProps = {
  field: FieldType;
};

export const FieldOverlay = (props: FieldOverlayProps) => {
  const { field, ...rest } = props;
  const { type } = field;

  const storeField = useAppSelector(fieldSelector(field.id));

  const Component = getRenderer(type);
  return (
    <div className={cn('relative', type !== 'spacer' && 'rounded-md bg-white')}>
      <div className="absolute h-full w-full"></div>
      <div className="p-3">
        <Component id={field.id} {...rest} {...storeField?.fieldProps} />
      </div>
    </div>
  );
};

type FieldProps = {
  field: FieldType;
  overlay?: boolean;
  isDragging?: boolean;
  isElementOverlayOpened?: boolean;
};

export const Field = (props: FieldProps) => {
  const { field, overlay, isDragging, isElementOverlayOpened, ...rest } = props;
  const { type } = field;

  const storeField = useAppSelector(fieldSelector(field.id));

  const Component = getRenderer(type);
  return (
    <div className={cn('relative', type !== 'spacer' && 'rounded-md bg-white')}>
      <div className="absolute h-full w-full"></div>
      {isElementOverlayOpened ? <ElementOverlay field={field} /> : null}
      <div className="select-none p-3">
        <Component id={field.id} {...rest} {...storeField?.fieldProps} />
      </div>
    </div>
  );
};

type SortableFieldProps = { id: string | number; index: number; field: FieldType };

const SortableField = (props: SortableFieldProps) => {
  const { id, index, field, ...rest } = props;
  const editFieldInfo = useAppSelector(editFieldSelector);

  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);
  const isElementEditing = editFieldInfo.field?.id === id;

  const isElementOverlayOpened = isHover || isElementEditing;

  const { setNodeRef, listeners, attributes, transform, transition, isDragging } = useSortable({
    id,
    data: { index, id, field },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div ref={hoverRef}>
        <Field
          field={field}
          {...rest}
          isDragging={isDragging}
          isElementOverlayOpened={isElementOverlayOpened}
        />
      </div>
    </div>
  );
};

type CanvasProps = {
  fields?: FieldType[];
};

export const Canvas = (props: CanvasProps) => {
  const { fields } = props;

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas_dropable',
    data: { parent: null, isContainer: true },
  });
  return (
    <div
      className={cn(
        'mx-16 my-12 flex-grow basis-0 overflow-y-auto border-2 border-gray-400 bg-gray-200 p-6',
        isOver ? 'border-dashed' : '',
      )}
    >
      <div ref={setNodeRef} className="flex h-full flex-col justify-start gap-3 ">
        {fields?.map((f, i) => <SortableField key={f.id} field={f} id={f.id} index={i} />)}
      </div>
    </div>
  );
};
