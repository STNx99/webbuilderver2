import React from "react";
import { SignUp } from "@clerk/nextjs";

const SignUpPage: React.FC = () => {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <div>
        Authentication is not configured. Please contact the administrator.
      </div>
    );
  }

  return <SignUp />;
};

export default SignUpPage;
