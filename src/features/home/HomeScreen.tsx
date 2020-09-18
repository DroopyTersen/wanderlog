import React from "react";
import { Link } from "react-router-dom";
import { useOvermind } from "global/overmind";
import { AppBackground, Footer, AddButton } from "global/components";
import "./home.scss";

export function HomeScreen() {
  let { state } = useOvermind();
  return (
    <>
      <AppBackground variant="sharp" />
      <div className="home content centered">
        <h1 className="app-title">Wanderlog</h1>
        <h3 className="tagline">Lust less. Remember more.</h3>
      </div>
      <Footer>
        {state.auth.isLoggedIn && (
          <AddButton>
            <Link to="/trip/new">Trip</Link>
            <Link to="/photos/new">Photo</Link>
            <Link to="/dailylogs/new">Daily Log</Link>
          </AddButton>
        )}
        {!state.auth.isLoggedIn && (
          <Link to="/login">
            <button className="gold">Log in</button>
          </Link>
        )}
      </Footer>
    </>
  );
}
