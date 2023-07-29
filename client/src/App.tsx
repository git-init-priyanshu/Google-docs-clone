import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";

import Doc from "./Components/Doc";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
// Defining router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Home />} />
      <Route
        path="/documents/:id"
        element={
          <>
            <Navbar />
            <Doc />
          </>
        }
      />
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

function Root() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
