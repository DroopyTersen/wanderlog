import { useSearchParams } from "react-router-dom";

export const LoginFormWrapper = ({ children, title }) => {
  let [searchParams] = useSearchParams();
  let error = searchParams?.get("error");

  return (
    <div className="w-full h-full grid place-items-center mt-[min(20vw,20vh)] center">
      <div className="p-8 bg-primary-700/70 backdrop-blur-sm shadow rounded-xl w-[400px] max-w-[94vw]">
        <h1 className="text-5xl text-center mb-8">{title}</h1>
        {error && (
          <div className="mb-8 bg-red-700/60 text-red-50 font-medium p-3 text-center rounded-lg">
            {error}
          </div>
        )}
        <form method="post" action="/api/login">
          {children}
        </form>
      </div>
    </div>
  );
};
