import { createContext, useContext, useState } from "react";

const RouteProviderContext = createContext({ currentRoute: "/", setCurrentRoute: (_route: string) => {} });

export function RouteProvider({ children, storageKey = "current-route", }: { children?: React.ReactNode, storageKey?: string }) {
    const [currentRoute, setCurrentRoute] = useState<string>(
        () => (localStorage.getItem(storageKey) as string) || "/"
    )

    const value = {
        currentRoute,
        setCurrentRoute: (route: string) => {
            localStorage.setItem(storageKey, route)
            setCurrentRoute(route);
        },
    }

    return (
        <RouteProviderContext.Provider value={value}>
            {children}
        </RouteProviderContext.Provider>
    );
}

export const useRoute = () => {
    const context = useContext(RouteProviderContext);
    
    if (context === undefined)
        throw new Error("useRoute must be used within a RouteProvider")
    
    return context;
}

