import { cn, useClickOutside } from '~/shared/lib';
import { FieldType, renderers } from './fields';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { useRef, useState } from 'react';
import { Button } from '~/shared/ui';
import { Edit, Trash } from 'lucide-react';
import { useAppDispatch } from '~/app/hooks';
import { removeField } from '~/pages/builder';

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
  const overlayRef = useRef(null);
  const dispatch = useAppDispatch();
  useClickOutside(overlayRef, onClose);
  return (
    <div ref={overlayRef} className="absolute h-full w-full rounded-sm border-4 border-blue-500">
      <div className="relative">
        <div className="absolute right-0 top-0 rounded-bl-md bg-blue-500 pb-1 pl-1">
          <Button variant={'ghost'} size={'icon'} className="hover:bg-blue-700">
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

type FieldProps = {
  field: FieldType;
  overlay?: boolean;
};

export const Field = (props: FieldProps) => {
  const { field, overlay, ...rest } = props;
  const { type } = field;
  const [isElementOverlayOpened, setIsElementOverlayOpened] = useState(false);

  const hideOverlay = () => setIsElementOverlayOpened((prev) => !prev);

  const Component = getRenderer(type);
  return (
    <div onClick={hideOverlay} className={cn('relative', type !== 'spacer' && 'rounded-md bg-white')}>
      {isElementOverlayOpened ? <ElementOverlay id={field.id} onClose={hideOverlay} /> : null}
      <div className="p-3">
        <Component id={field.id} {...rest} />
      </div>
    </div>
  );
};

type SortableFieldProps = { id: string | number; index: number } & FieldProps;

const SortableField = (props: SortableFieldProps) => {
  const { id, index, field, ...rest } = props;

  const { setNodeRef, listeners, attributes, transform, transition } = useSortable({ id, data: { index, id, field } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Field field={field} {...rest} />
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
        isOver ? 'border-4 border-dashed' : '',
      )}
    >
      <div ref={setNodeRef} className="flex h-full flex-col justify-start gap-3 ">
        {fields?.map((f, i) => <SortableField key={f.id} field={f} id={f.id} index={i} />)}
      </div>
    </div>
  );
};
