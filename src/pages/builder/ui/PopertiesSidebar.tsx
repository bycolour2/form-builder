import React, { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import {
  editFieldSelector,
  fieldSelector,
  fieldsSelector,
  saveEditFieldProps,
  updateEditFieldProp,
} from '~/pages/builder';
import { Button, Input } from '~/shared/ui';

type PopertiesSidebarProps = {};

export const PopertiesSidebar = (props: PopertiesSidebarProps) => {
  const dispatch = useAppDispatch();
  const { elementProps, field } = useAppSelector(editFieldSelector);
  // const storeField = useAppSelector(fieldSelector(field ? field.id : ''));
  // console.log(storeField);
  // const [fieldProps, setFieldProps] = useState(storeField?.fieldProps);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>, fieldId: Id, key: string) => {
    // setFieldProps((prev) => {
    //   const newValue = { ...prev, key: event.currentTarget.value };
    //   return prev;
    // });
    dispatch(updateEditFieldProp({ fieldId, key, value: event.currentTarget.value }));
  };

  // console.log(fieldProps);
  console.log(elementProps?.type);

  return (
    <div className="flex w-[350px] flex-col border-l border-black">
      <div className="mb-3 border-b border-black px-3.5 py-2.5 text-center">Properties</div>
      {elementProps && field ? ( //&& storeField
        <div className="flex flex-col gap-2 px-2 py-1">
          {Object.entries(elementProps).map(([key, value]) => {
            console.log('[key, value]', [key, value]);

            return (
              <div
                key={key}
                className="flex flex-row items-center justify-between border border-black px-1.5 py-1"
              >
                <span>{key}:</span>
                <div className="w-2/3">
                  {typeof value.defaultValue === 'string' ? (
                    <Input
                      value={elementProps[key as keyof typeof elementProps]!.defaultValue}
                      onChange={(e) => onChangeHandler(e, field.id, key)}
                    />
                  ) : null}
                  {/* <div>{value ? value.toString() : ''}</div> */}
                </div>
              </div>
            );
          })}
          <Button type="button" onClick={() => dispatch(saveEditFieldProps())}>
            Save
          </Button>
        </div>
      ) : null}
    </div>
  );
};
