import { Label } from '@radix-ui/react-label';
import {
  Button,
  ButtonProps,
  Input,
  InputProps,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  TypographyP,
} from '~/shared/ui';
import { TypographyH2 } from '~/shared/ui/typography/typographyH2';

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

type FieldDescription = {
  type: string;
  availableProps: Record<string, any>; //InputProps | ButtonProps;
  renderer: (props: any) => JSX.Element;
};

export const renderersD: Record<string, FieldDescription> = {
  input: {
    type: 'input',
    availableProps: { type: 'text', placeholder: 'Type your text' } as InputProps,
    renderer: ({ id }: { id: Id }) => (
      <>
        <Label htmlFor={`input-${id}`} className="text-sm">
          Input
        </Label>
        <Input id={`input-${id}`} placeholder="Type your text" type="text" />
      </>
    ),
  },
  select: {
    type: 'select',
    availableProps: {},
    renderer: ({ id }: { id: Id }) => (
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
  },
  textarea: {
    type: 'textarea',
    availableProps: {},
    renderer: ({ id }: { id: Id }) => (
      <>
        <Label htmlFor={`textarea-${id}`}>Textarea</Label>
        <Textarea placeholder="Type your text here." id={`textarea-${id}`} />
      </>
    ),
  },
  text: { type: 'text', availableProps: {}, renderer: () => <Text /> },
  button: {
    type: 'button',
    availableProps: { type: 'button', asChild: true } as ButtonProps,
    renderer: () => (
      <Button type="button" variant={'default'}>
        Button
      </Button>
    ),
  },
};

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
    <Button type="button" variant={'default'}>
      Button
    </Button>
  ),
};

const Text = () => {
  return (
    <>
      <TypographyH2>Lorem, ipsum dolor.</TypographyH2>
      <TypographyP>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus illum, iure cum necessitatibus consequatur
        voluptatum vitae amet! Officia aliquid perferendis mollitia ipsa laudantium tempore deleniti consequuntur
        voluptatem tempora, nesciunt fugit.
      </TypographyP>
    </>
  );
};
