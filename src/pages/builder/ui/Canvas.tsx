import { cn, useClickOutside } from '~/shared/lib';
import { FieldType, renderers } from './fields';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';
import { Button } from '~/shared/ui';
import { Edit, Trash } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { editFieldSelector, removeField, setEditField } from '~/pages/builder';

const getRenderer = (type: string) => {
  if (type === 'spacer') {
    return () => {
      return <div className={cn('h-20 rounded-md bg-black px-3 py-2.5 opacity-40')}>spacer</div>;
    };
  }

  return renderers[type] || (() => <div>No renderer found for {type}</div>);
};

type ElementOverlayProps = { id: Id; onClose: () => void };

const ElementOverlay = ({ id, onClose }: ElementOverlayProps) => {
  const dispatch = useAppDispatch();
  const overlayRef = useRef(null);
  useClickOutside(overlayRef, onClose);

  return (
    <div ref={overlayRef} className="absolute h-full w-full rounded-sm border-4 border-blue-500">
      <div className="relative">
        <div className="absolute right-0 top-0 rounded-bl-md bg-blue-500 pb-1 pl-1">
          <Button
            variant={'ghost'}
            size={'icon'}
            onClick={() => dispatch(setEditField({ id }))}
            className="hover:bg-blue-700"
          >
            <Edit className="h-4 w-4 text-white" />
          </Button>
          <Button
            variant={'ghost'}
            size={'icon'}
            onClick={() => dispatch(removeField({ id }))}
            className="hover:bg-blue-700"
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

  const Component = getRenderer(type);
  return (
    <div className={cn('relative', type !== 'spacer' && 'rounded-md bg-white')}>
      <div className="absolute h-full w-full"></div>
      <div className="p-3">
        <Component id={field.id} {...rest} />
      </div>
    </div>
  );
};

type FieldProps = {
  field: FieldType;
  overlay?: boolean;
  isDragging?: boolean;
  onClick?: () => void;
  onClose: () => void;
  isElementOverlayOpened?: boolean;
};

export const Field = (props: FieldProps) => {
  const { field, overlay, isDragging, onClick, onClose, isElementOverlayOpened, ...rest } = props;
  const { type } = field;

  const Component = getRenderer(type);
  return (
    <div onClick={onClick} className={cn('relative', type !== 'spacer' && 'rounded-md bg-white')}>
      <div className="absolute h-full w-full"></div>
      {isElementOverlayOpened ? <ElementOverlay id={field.id} onClose={onClose} /> : null}
      <div className="select-none p-3">
        <Component id={field.id} {...rest} />
      </div>
    </div>
  );
};

type SortableFieldProps = { id: string | number; index: number; field: FieldType };

const SortableField = (props: SortableFieldProps) => {
  const { id, index, field, ...rest } = props;
  const editField = useAppSelector(editFieldSelector);

  const [isElementOverlayOpened, setIsElementOverlayOpened] = useState(false);

  const toggleOverlay = () => setIsElementOverlayOpened((prev) => !prev);
  const closeOverlay = () => setIsElementOverlayOpened(false);

  const { setNodeRef, listeners, attributes, transform, transition, isDragging } = useSortable({
    id,
    data: { index, id, field },
    disabled: isElementOverlayOpened,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isDragging) setIsElementOverlayOpened(false);
  }, [isDragging]);

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div>
        <Field
          field={field}
          {...rest}
          isDragging={isDragging}
          onClick={toggleOverlay}
          onClose={closeOverlay}
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
