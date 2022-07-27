import { Link, useSearchParams } from "react-router-dom";
import { Button } from "~/components";
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
        <Button className="gold w-full">Sign up</Button>
        <div className="flex justify-center gap-1 mt-6 items-center">
          <span className="mr-2 text-gray-300">Already a user?</span>
          <Link to="/login" className=" font-bold">
            Log in
          </Link>
        </div>
      </div>
    </>
  );
};
