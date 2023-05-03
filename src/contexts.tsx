import { createContext, useContext } from "react";

export const ReadonlyContext = createContext({
    readonly: false,
    showComments : false
})


export const useReadonly = () => {
    const context = useContext(ReadonlyContext);

    return context;
};