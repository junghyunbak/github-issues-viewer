// react
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// constants
import { defaultValue } from "@/constants";

// components
import { NotFound } from "@/pages/NotFound";
import { Main } from "@/pages/Main";
import { GlobalStyle } from "./components/GlobalStyle";
import { ReactQueryProvider } from "./components/ReactQueryProvider";
import { GlobalErrorBoundary } from "./components/GlobalErrorBoundary";

export function Index() {
  return (
    <ReactQueryProvider>
      <GlobalStyle>
        <GlobalErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <Navigate
                    replace
                    to={`/${defaultValue.DEFAULT_REPO_OWNER}/${defaultValue.DEFAULT_REPO_NAME}`}
                  />
                }
              />
              <Route path="/:owner/:repo" element={<Main />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </GlobalErrorBoundary>
      </GlobalStyle>
    </ReactQueryProvider>
  );
}
