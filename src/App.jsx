// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";

import Users from "./pages/Users";
import UserForm from "./pages/UserForm";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Appointments from "./pages/Appointments";
import AppointmentDetails from "./pages/AppointmentDetails";
import OrderPage from "./pages/OrderPage";
import OrderDetails from "./pages/OrderDetails";
import ItemPage from "./pages/ItemPage";
import ItemDetails from "./pages/ItemDetails";

function App() {
  const { auth } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={auth.token ? <Dashboard /> : <Navigate to="/" />}
        >
          {/* Nested Routes inside Dashboard */}
          <Route path="users" element={<Users />} />
          <Route path="users/add" element={<UserForm />} />
          <Route path="users/edit/:id" element={<UserForm />} />

          <Route path="customers" element={<Customers />} />
          <Route path="customers/new" element={<CustomerDetails />} />
          <Route path="customers/:id" element={<CustomerDetails />} />

          <Route path="appointments" element={<Appointments />} />
          <Route path="appointments/new" element={<AppointmentDetails />} />
          <Route path="appointments/:id" element={<AppointmentDetails />} />

          <Route path="/dashboard/orders" element={<OrderPage />} />
          <Route path="/dashboard/orders/add" element={<OrderDetails />} />
          <Route path="/dashboard/orders/edit/:id" element={<OrderDetails />} />

          <Route path="/dashboard/items" element={<ItemPage />} />
          <Route path="/dashboard/items/add" element={<ItemDetails />} />
          <Route path="/dashboard/items/edit/:id" element={<ItemDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
