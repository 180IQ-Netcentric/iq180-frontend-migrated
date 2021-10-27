import React, { createContext, useState } from "react";
import { User, UserInfo } from "../dto/Authentication.dto";

export interface UserConstruct {
  user: User | UserInfo | undefined;
  setUser: (value: User | UserInfo | undefined) => void;
  clearUser: () => void;
}

export const UserContext = createContext({} as UserConstruct);

const UserContextProvider = ({ ...props }) => {
  const [user, setUser] = useState<User | UserInfo | undefined>();

  const clearUser = () => {
    setUser(undefined);
  };

  const value = { user, setUser, clearUser };
  return <UserContext.Provider value={value} {...props} />;
};

export default UserContextProvider;
