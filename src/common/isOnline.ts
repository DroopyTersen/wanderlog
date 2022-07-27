import { createStore, useStore } from "./globalStore";
let isOnlineStore = createStore<boolean>(window?.navigator?.onLine);

export const useIsOnline = () => {
  let [isOnline, setIsOnline] = useStore(isOnlineStore);
  return isOnline;
};

window.addEventListener("offline", function (e) {
  console.log("You went OFFLINE!");
  isOnlineStore.setState(false);
});

window.addEventListener("online", function (e) {
  console.log("You're back ONLINE!");
  isOnlineStore.setState(true);
});
