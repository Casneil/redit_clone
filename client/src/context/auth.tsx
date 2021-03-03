import { createContext, useReducer, useContext, useEffect } from "react";

import Axios from "axios";
// Interfaces and Enums
import { IState, IAction } from "../interfaces";
import { REDUCER_ENUM } from "../emums";

const StateContext = createContext<IState>({
  authenticated: false,
  user: null,
  loading: true,
});

const initialState = {
  user: null,
  authenticated: false,
  loading: true,
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

    case REDUCER_ENUM.STOP_LOADING:
      return {
        ...state,
        loading: false,
      };

    default:
      throw new Error(`Unknown action type ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, initialState);

  const dispatch = (type: string, payload?: any) =>
    defaultDispatch({ type, payload });

  useEffect(() => {
    Axios.get("/auth/me")
      .then((res) => {
        dispatch(REDUCER_ENUM.LOGIN, res.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        dispatch(REDUCER_ENUM.STOP_LOADING);
      });
  }, []);

  return (
    <DispatchContext.Provider value={defaultDispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
