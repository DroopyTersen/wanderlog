import React from "react";
import { useSyncListener } from "../shared/useSyncListener";
import useAsyncData from "../hooks/useAsyncData";
import { DailyLogModel } from "../../models";
import Footer from "../global/Footer/Footer";
import AddButton from "../global/AddButton/AddButton";
import { Link } from "react-router-dom";
import AppBackground from "../global/AppBackground/AppBackground";
import Header from "../global/Header/Header";

export default function DailyLogsList() {
  let { data: items, isLoading } = useDailyLogs();

  if (isLoading) return null;

  return (
    <>
      <AppBackground variant="blurred" />
      <Header title="Daily Logs" />
      <Footer>
        <AddButton>
          <Link to="/trip/new">Trip</Link>
          <Link to="/photos/new">Photo</Link>
          <Link to="/dailylogs/new">Daily Log</Link>
        </AddButton>
      </Footer>
    </>
  );
}

function useDailyLogs() {
  let refreshToken = useSyncListener(["dailyLogs"]);
  return useAsyncData<DailyLogModel[]>(DailyLogModel.loadRecent, [], []);
}
