import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import NoPage from "./NoPage";
import Request from "./Request";
import RequestsRecord from "./RequestsRecord";

export default function Router() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
            <Route path="request" element={<Request />} />
            <Route path="requests-record" element={<RequestsRecord />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
}