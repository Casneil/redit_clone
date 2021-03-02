export interface IInputGroupProps {
  className?: string;
  error?: string | undefined;
  type: string;
  placeholder: string;
  value: string;
  setValue: (string: string) => void;
}
