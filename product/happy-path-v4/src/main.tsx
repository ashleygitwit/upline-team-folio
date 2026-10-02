import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { previewFor } from "./questionnaire";
import { QuestionnairePreview } from "./screens/QuestionnairePreview";

// The questionnaire preview opens this same page in a new tab, at its own
// address, and is all that tab shows.
const preview = previewFor(window.location.hash);

createRoot(document.getElementById("root")!).render(
  <StrictMode>{preview ? <QuestionnairePreview askLife={preview.askLife} /> : <App />}</StrictMode>,
);
