import { Label } from '@radix-ui/react-label';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  TypographyP,
} from '~/shared/ui';

export type FieldType = {
  id: Id;
  type: string;
  title?: string;
  name?: string;
  parent?: null;
};

export type StableFieldType = {
  type: string;
  title: string;
};

export const fields: StableFieldType[] = [
  {
    type: 'input',
    title: 'Input',
  },
  {
    type: 'select',
    title: 'Select',
  },
  {
    type: 'textarea',
    title: 'Textarea',
  },
  {
    type: 'text',
    title: 'Text',
  },
  {
    type: 'button',
    title: 'Button',
  },
];

export const renderers: Record<string, (props: any) => JSX.Element> = {
  input: ({ id }: { id: Id }) => (
    <>
      <Label htmlFor={`input-${id}`} className="text-sm">
        Input
      </Label>
      <Input id={`input-${id}`} placeholder="Type your text" type="text" />
    </>
  ),
  select: ({ id }: { id: Id }) => (
    <>
      <Label htmlFor={`select-${id}`} className="text-sm">
        Select
      </Label>
      <Select>
        <SelectTrigger id={`select-${id}`}>
          <SelectValue placeholder="Select your something" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="something1">Something 1</SelectItem>
          <SelectItem value="something2">Something 2</SelectItem>
          <SelectItem value="something3">Something 3</SelectItem>
        </SelectContent>
      </Select>
    </>
  ),
  textarea: ({ id }: { id: Id }) => (
    <>
      <Label htmlFor={`textarea-${id}`}>Textarea</Label>
      <Textarea placeholder="Type your text here." id={`textarea-${id}`} />
    </>
  ),
  text: () => <Text />,
  button: () => (
    <>
      <Button variant={'default'}>Button</Button>
    </>
  ),
};

const Text = () => {
  return (
    <>
      <TypographyP>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos natus soluta sit numquam saepe, corrupti dolorum,
        deleniti quo a beatae perspiciatis rem expedita tempore obcaecati porro dolorem? Voluptates, enim commodi?
        Quaerat ratione ex excepturi ad, quis voluptatibus voluptates sapiente perferendis adipisci sequi modi inventore
        labore minus delectus a libero consequuntur beatae doloribus reprehenderit ullam aliquid nobis quibusdam quod
        qui. Amet.
      </TypographyP>
    </>
  );
};
