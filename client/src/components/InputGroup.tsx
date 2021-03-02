import classNames from "classnames";

//Interfaces
import { IInputGroupProps } from "../interfaces";

const InputGroup: React.FC<IInputGroupProps> = ({
  className,
  type,
  placeholder,
  value,
  setValue,
  error,
}) => {
  return (
    <div className={className}>
      <input
        type={type}
        className={classNames(
          "w-full p-3 py-2 transition duration-200 border rounded outline-none bg-gray-50 bg-grey-100 border-grey-300 focus:bg-white hover:bg-white",
          { "border-red-500": error }
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <small className="font-medium text-red-600">{error}</small>
    </div>
  );
};

export default InputGroup;
