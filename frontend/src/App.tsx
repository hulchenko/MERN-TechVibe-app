import "react-toastify/dist/ReactToastify.css";
import { NextUIProvider } from "@nextui-org/react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";
import Header from "./components/Header";

const App = () => {
  return (
    <>
      <Header />
      <NextUIProvider>
        <main className="px-96">
          <Outlet />
        </main>
      </NextUIProvider>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
