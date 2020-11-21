import React from "react";
import { Link } from "react-router-dom";
import { AppBackground, Footer, AddButton } from "global/components";
import "./home.scss";
import { useAuth } from "features/auth/auth.provider";
import { Button, Popup } from "core/components";
import { LoginForm } from "features/auth/LoginForm";

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
        {!isLoggedIn && <LoginButton />}
      </Footer>
    </>
  );
}

export function LoginButton() {
  let { ref: popupRef, isOpen, setIsOpen } = Popup.usePopup();

  return (
    <div ref={popupRef} className="login-popup">
      <button onClick={() => setIsOpen((val) => !val)} className="gold">
        Login
      </button>
      <Popup isOpen={isOpen} close={() => setIsOpen(false)} title="Login" className="from-right">
        <LoginForm />
      </Popup>
    </div>
  );
}
