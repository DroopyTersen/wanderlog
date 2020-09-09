import React from "react";
import { Link } from "react-router-dom";
import { useOvermind } from "global/overmind";
import { Card } from "core/components";
import { AppBackground, Header, Footer, AddButton } from "global/components";

export function ProfileScreen() {
  let { state, actions } = useOvermind();
  if (!state.auth.isLoggedIn) return null;

  let user = state.auth.currentUser;

  return (
    <>
      <AppBackground />
      <Header title="Profile" />
      <div className="content">
        <Card>
          <p>{user.displayName || user.email}</p>
        </Card>

        <Footer>
          <button type="button" className="gold" onClick={() => actions.auth.logout()}>
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