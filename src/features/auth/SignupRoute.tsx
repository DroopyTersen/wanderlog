import { Link, useSearchParams } from "react-router-dom";
import { InputField } from "~/components/inputs/InputField";

export const SignupRoute = () => {
  let [searchParams] = useSearchParams();
  return (
    <>
      <input type="hidden" name="mode" value="signup" />
      <InputField
        label="Username"
        name="username"
        required
        autoFocus
        defaultValue={searchParams.get("username") || ""}
      />
      <InputField label="Password" name="password" type="password" required />
      <InputField
        label="Full name"
        name="name"
        defaultValue={searchParams.get("name") || ""}
      />
      <div className="mt-4">
        <button className="btn btn-primary w-full">Sign up</button>
        <div className="flex justify-center gap-1 mt-6 items-center">
          <span className="mr-2 text-gray-300">Already a user?</span>
          <Link to="/login" className="font-bold">
            Log in
          </Link>
        </div>
      </div>
    </>
  );
};
