import React from 'react';

declare module 'react' {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type MouseEvent<T = HTMLButtonElement> = React.MouseEventHandler<T>;

export type MouseEventCurry<T = HTMLButtonElement, P = string> = (
  id: P
) => MouseEvent<T>;

export type ChangeEvent<T = HTMLInputElement> = React.ChangeEventHandler<T>;

export type ChangeEventCurry<T = string> = (id: T) => ChangeEvent;

export type ClipboardEvent<T = HTMLInputElement> =
  React.ClipboardEventHandler<T>;

export type FocusEvent<T = HTMLInputElement> = React.FocusEventHandler<T>;

export type FocusEventCurry<T = string> = (id: T) => FocusEvent;

export type ClickEvent<T = HTMLButtonElement> = React.MouseEventHandler<T>;

export type ClickEventCurry<T = HTMLButtonElement, P = string> = (
  id: P
) => ClickEvent<T>;

export type KeyDownEvent<T = HTMLInputElement> = React.KeyboardEventHandler<T>;

export type KeyboardEvent<T = HTMLInputElement> = React.KeyboardEventHandler<T>;

export type FormEvent<T = HTMLFormElement> = React.FormEventHandler<T>;

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type FCC<T = {}> = React.FC<React.PropsWithChildren<T>>;
