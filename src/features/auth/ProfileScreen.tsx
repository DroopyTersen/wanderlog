import React from "react";
import { Link } from "react-router-dom";
import { AppBackground, Header, Footer, AddButton } from "global/components";
import { useAuth } from "./auth.provider";

export function ProfileScreen() {
  let { isLoggedIn,  currentUser:user, logout } = useAuth();
  if (!isLoggedIn) return null;


  return (
    <>
      <AppBackground variant="sharp" />
      <Header title="Profile" />
      <div className="content profile-screen">
        <div className="card">
          <p>{user.name || user.email || user.username}</p>
        </div>

        <Footer>
          <button type="button" className="gold" onClick={() => logout()}>
            SIGN OUT
          </button>
          <AddButton>
            <Link to="/places/new">Place</Link>
            <Link to="/trip/new">Trip</Link>
            <Link to="/photos/new">Photo</Link>
            <Link to="/dailylogs/new">Daily Log</Link>
          </AddButton>
        </Footer>
      </div>
    </>
  );
}
