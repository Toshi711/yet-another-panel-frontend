import Outer from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import * as React from "react";
import Home from "./pages/Home";
import Licenses from "./pages/Licenses";
import Changelog from "./pages/Changelog";
import Faq from "./pages/Faq";
import Profile from "./pages/User";
import api from "./utils/api";
import ProductItem from "./pages/ProductInfo";
import Products from "./pages/ProductsList";
import ProductAdmin from "./pages/ProductEditing";
import LicenseСonfig from "./pages/ConfigGenerator";
import useProfile from "./store/useProfile";
import NotFound from "./pages/NotFound";
import { message } from "antd";
import ErrorBoundary from "./guards/ErrorBoundary";

const App = () => {


  const { setRole, setUser, setLicenses } = useProfile();

  useEffect(() => {
    const getUser = async () => {
      try {
        const jwt = await api.getJWT();
        if (jwt) {
          const user = await api.getMe();

          const profile = await api.getDiscord(jwt.accessToken);
          const licenses = await api.getLicenses(jwt.discordId);

          setLicenses(licenses);
          setUser(profile);
          setRole(user.role);
        }
      } catch (e) {
        console.log(e);
      }
    };

    getUser();
  }, []);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Outer />}>
          <Route path="/" element={<Home />} />
          <Route path="/licenses" element={<Licenses />} />
          <Route path="/updates" element={<Changelog />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/user/:id" element={<Profile />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductItem />} />
          <Route path="/products/edit/:id" element={<ProductAdmin />} />
          <Route path="/products/config/:id" element={<LicenseСonfig />} />
          <Route path="*" element={<NotFound />}></Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
