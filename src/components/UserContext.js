import { createContext } from "react";

export const UserContext = createContext({ online: false, owns: {}, subs: {} });