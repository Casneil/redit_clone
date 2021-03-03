import { createContext, useReducer, useContext } from "react";

// Interfaces and Enums
import { IState, IAction } from "../interfaces";
import { REDUCER_ENUM } from "../emums";

const StateContext = createContext<IState>({
  authenticated: false,
  user: null,
});

const initialState = {
  user: null,
  authenticated: false,
};

const DispatchContext = createContext(null);

const reducer = (state: IState, { type, payload }: IAction) => {
  switch (type) {
    case REDUCER_ENUM.LOGIN:
      return {
        ...state,
        authenticated: true,
        user: payload,
      };

    case REDUCER_ENUM.LOGOUT:
      return {
        ...state,
        authenticated: false,
        user: null,
      };

    default:
      throw new Error(`Unknown action type ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
