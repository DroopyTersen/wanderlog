import { useRegisterSW } from "virtual:pwa-register/react";

export function ReloadPrompt() {
  let {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };
  if (!offlineReady && !needRefresh) return null;
  return (
    <div className="alert alert-info bg-pink/90 z-20 text-primary-700 shadow-lg flex justify-between items-center fixed w-[98vw] left-[1vw] right-[1vw] top-[env(safe-area-inset-top,_4px)]">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current flex-shrink-0 w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        {offlineReady ? (
          <span>
            Offline mode is ready. You can now use Wanderlog without internet.
          </span>
        ) : (
          <span>A newer better version of the app is available.</span>
        )}
      </div>
      <div>
        {needRefresh && (
          <button
            className="btn btn-sm text-white"
            onClick={() => updateServiceWorker(true)}
          >
            Upgrade!
          </button>
        )}
        {offlineReady && (
          <button
            className="btn btn-ghost btn-primary btn-sm"
            onClick={() => close()}
          >
            Got it!
          </button>
        )}
      </div>
    </div>
  );
}
