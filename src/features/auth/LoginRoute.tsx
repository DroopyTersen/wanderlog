import { Link, useSearchParams } from "react-router-dom";
import { Button } from "~/components";
import { InputField } from "~/components/inputs/InputField";

export const LoginRoute = () => {
  let [searchParams] = useSearchParams();

  return (
    <>
      <input type="hidden" name="mode" value="login" />
      <InputField
        label="Username"
        name="username"
        required
        autoFocus
        defaultValue={searchParams.get("username") || ""}
      />
      <InputField label="Password" name="password" type="password" required />
      <div className="mt-4">
        <Button className="gold w-full">Login</Button>
        <div className="flex justify-center gap-1 mt-6 items-center">
          <span className="mr-2 text-gray-300">New user?</span>
          <Link to="/signup" className=" font-bold">
            Sign up here
          </Link>
        </div>
      </div>
    </>
  );
};
