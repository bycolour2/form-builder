import { useRef } from 'react';
import { StableFieldType, fields } from './fields';
import { nanoid } from '@reduxjs/toolkit';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '~/shared/lib';

type SidebarFieldProps = {
  field: StableFieldType;
  overlay?: boolean;
};

export const SidebarField = (props: SidebarFieldProps) => {
  const { field, overlay = false } = props;

  return (
    <div className={cn('flex items-center justify-center px-5 py-3.5', overlay ? 'bg-black text-white' : '')}>
      {field.title}
    </div>
  );
};

type DraggableSidebarFieldProps = {} & SidebarFieldProps;

const DraggableSidebarField = (props: DraggableSidebarFieldProps) => {
  const { field, ...rest } = props;

  const id = useRef(nanoid());

  const { setNodeRef, listeners, attributes } = useDraggable({
    id: id.current,
    data: {
      field,
      fromSidebar: true,
    },
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className="cursor-pointer select-none border-b border-black">
      <SidebarField field={field} {...rest} />
    </div>
  );
};

type SidebarProps = {
  fieldsRegKey: string | number;
};

export const Sidebar = (props: SidebarProps) => {
  const { fieldsRegKey } = props;
  return (
    <>
      <div key={fieldsRegKey} className="flex w-[250px] flex-col border-r border-black">
        {fields.map((f) => (
          <DraggableSidebarField key={f.type} field={f} />
        ))}
      </div>
    </>
  );
};
