import React from "react";
import { Link } from "react-router-dom";
import { AppBackground, Footer, AddButton } from "global/components";
import "./home.scss";
import { useAuth } from "features/auth/auth.provider";

export function HomeScreen() {
  let { isLoggedIn } = useAuth();
  return (
    <>
      <AppBackground variant="sharp" />
      <div className="home content centered">
        <h1 className="app-title">Wanderlog</h1>
        <h3 className="tagline">Lust less. Remember more.</h3>
      </div>
      <Footer>
        {isLoggedIn && (
          <AddButton>
            <Link to="/trips/new">Trip</Link>
            <Link to="/photos/new">Photo</Link>
            <Link to="/dailylogs/new">Daily Log</Link>
          </AddButton>
        )}
        {!isLoggedIn && (
          <Link to="/login">
            <button className="gold">Log in</button>
          </Link>
        )}
      </Footer>
    </>
  );
}
