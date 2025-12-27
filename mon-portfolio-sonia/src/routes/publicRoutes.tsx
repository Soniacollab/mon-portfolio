import { Route } from "react-router-dom";
import PublicPage from "../pages/PublicPage";

export default function PublicRoutes(): JSX.Element {
  return <Route path="/*" element={<PublicPage />} />;
}
