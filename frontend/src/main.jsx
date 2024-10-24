import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import AddRestaurant from "./pages/AddRestaurant/AddRestaurant";
import AddRestForm from "./components/AddRestaurantComponents/AddRestraurent/AddRestraurentForm";
import ShowCase from "./pages/ShowCase/ShowCase";
import RestaurantPage from "./pages/RestaurantPage/RestaurantPage";
import User from "./pages/User/User";
import GetTheApp from "./pages/GetTheApp/GetTheApp";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import SkipedPage from "./pages/SkipedPage/SkipedPage";
import UserSettingsPage from "./pages/UserSettingsPage/UserSettingsPage";
import ShopDashboard from "./pages/ShopDashboard/ShopDashboard";
import OrderBodyComponent from "./components/RestaurantComponents/OrderBodyComponent/OrderBodyComponent";

import { UserProvider } from "./Context/UserContext";

import TestPage from "./pages/TestPage/TestPage";
// import AddRestaurantHeader from './components/AddRestaurantHeader/AddRestaurantHeader'
import App from "./App";
import "./index.css";
import Login from "./components/Auth/Login/Login";
import RateYourExperienceCard from "./utils/Cards/RestaurantBodyCards/RateYourExperienceCard/RateYourExperienceCard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <Routes>
        <Route index element={<App />} />
        <Route path="/" element={<App />} />
        <Route path="/add-restaurant" element={<AddRestaurant />} />
        <Route path="/register-restraurent" element={<AddRestForm />} />
        <Route path="/show-case" element={<ShowCase />} />
        <Route path="/user/:userId" element={<User />} />
        <Route path="/user/:userId/:hashId" element={<User />} />
        <Route path="/user/:userId/notifications" element={<SkipedPage />} />
        <Route path="/user/:userId/network" element={<SkipedPage />} />
        <Route path="/user/:userId/find-friends" element={<SkipedPage />} />
        <Route path="/user/settings" element={<UserSettingsPage />} />
        <Route path="/get-the-app" element={<GetTheApp />} />
        <Route path="/:city/:hotel" element={<RestaurantPage />} />
        <Route path="/order/:id/:page" element={<RestaurantPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/rate-experience" element={<RateYourExperienceCard />} />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ShopDashboard />} />
        <Route path="/order/:id" element={<RestaurantPage />} />

        {/* <Route
        path="/order/:id/:city/:hotel/overview"
        element={<RestaurantPage />}
      />
      <Route
        path="/order/:id/:city/:hotel/review"
        element={<RestaurantPage />}
      />
      <Route path="/order/:id/:city/:hotel/menu" element={<RestaurantPage />} /> */}
      </Routes>
    </UserProvider>
  </BrowserRouter>
);
