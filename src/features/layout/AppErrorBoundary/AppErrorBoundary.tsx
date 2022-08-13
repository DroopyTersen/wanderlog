// We can reuse this component for
// both unhandled exceptions (ErrorBoundary)

import { useRouteError } from "react-router-dom";
import { ErrorContainer } from "~/components/surfaces/ErrorContainer";

// and thrown Responses (CatchBoundary)
export const AppErrorBoundary = () => {
  let error: any = useRouteError();
  let message = tryParseMessage(error);

  return (
    <ErrorContainer title="Whoopsies" className="m-4 md:m-6">
      <pre className="whitespace-pre-wrap text-left text-sm">{message}</pre>
    </ErrorContainer>
  );
};

type ThrownErrorType =
  | string
  | Error
  | { status; data: any }
  // DIY Error
  | { message: string }
  // Diy error array
  | { message: string }[];

let tryParseMessage = (thrown: ThrownErrorType) => {
  console.log("🚀 | tryParseMessage | thrown", thrown);
  if (typeof thrown === "string") return thrown;
  if ("message" in thrown) return thrown.message;
  if ("data" in thrown) return thrown.data.message;
  if (Array.isArray(thrown))
    return thrown
      .map((e) => e?.message)
      .filter(Boolean)
      .join(", ");

  return "Unknown error";
};
