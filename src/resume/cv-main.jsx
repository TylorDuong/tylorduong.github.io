import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Resume } from "./Resume";
import "./print.css";

// The CV is the résumé component rendered with the "show everything" selection
// (variant="cv"), so it always lists every project and experience — including
// any added later — and flows across as many Letter pages as it needs.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Resume variant="cv" />
  </StrictMode>
);
