import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import NoPage from "./routes/NoPage";
import Request from "./routes/Request";
import RequestsRecord from "./routes/RequestsRecord";

export default function Router() {
    return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/request" element={<Request />} />
            <Route path="/requests-record" element={<RequestsRecord />} />
            <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    );
}