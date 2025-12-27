import React, { lazy, Suspense } from "react";
import Boards from "./pages/Boards";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores";
import { Login, Register } from "./pages/Auth";
const AdminRoomsLazy = React.lazy(() => import("./pages/Admin/AdminRooms.jsx"));
const AdminMessagesLazy = React.lazy(() =>
  import("./pages/Admin/AdminMessages.jsx")
);
const AdminConversationsLazy = React.lazy(() =>
  import("./pages/Admin/AdminConversations.jsx")
);
const InboxLazy = React.lazy(() => import("./pages/Messages/Inbox.jsx"));

const RoomsLazy = lazy(() => import("./pages/RoomDetails/RoomDetails.jsx"));
const AdminBookingsLazy = lazy(() => import("./pages/Admin/AdminBookings.jsx"));
import ChatWidget from "./components/Chat/ChatWidget.jsx";

function App() {
  const { isAuthenticated } = useAuthStore();

  // On app start try to refresh tokens and load current user
  React.useEffect(() => {
    useAuthStore.getState().initAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Trang Chính */}
        <Route
          path="/"
          element={isAuthenticated ? <Boards /> : <Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/rooms/:id"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <RoomsLazy />
            </Suspense>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <AdminBookingsLazy />
            </Suspense>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <AdminRoomsLazy />
            </Suspense>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <AdminMessagesLazy />
            </Suspense>
          }
        />
        <Route
          path="/admin/conversations"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <AdminConversationsLazy />
            </Suspense>
          }
        />
        <Route
          path="/messages"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <InboxLazy />
            </Suspense>
          }
        />
      </Routes>{" "}
      <ChatWidget />{" "}
    </BrowserRouter>
  );
}

export default App;
