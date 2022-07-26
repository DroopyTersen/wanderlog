import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "~/components";
import { InputField } from "~/components/inputs/InputField";
import { LoginFormWrapper } from "./LoginFormWrapper";

export const SignupRoute = () => {
  let [searchParams] = useSearchParams();
  return (
    <LoginFormWrapper title="Sign up">
      <input type="hidden" name="mode" value="signup" />
      <InputField
        label="Username"
        name="username"
        required
        className="mb-4"
        defaultValue={searchParams.get("username") || ""}
      />
      <InputField
        label="Password"
        name="password"
        className="mb-4"
        type="password"
        required
      />
      <InputField
        label="Full name"
        name="name"
        className="mb-4"
        defaultValue={searchParams.get("name") || ""}
      />
      <div className="mt-8">
        <Button className="gold w-full">Sign up</Button>
        <div className="flex justify-center gap-1 mt-6 items-center">
          <span className="mr-2 text-gray-300">Already a user?</span>
          <Link to="/login" className=" font-bold">
            Log in here
          </Link>
        </div>
      </div>
    </LoginFormWrapper>
  );
};
