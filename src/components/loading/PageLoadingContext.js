import { createContext } from "react";

// Presentation only: pages keep ownership of fetching, errors and access checks.
export const PageLoadingContext = createContext(null);