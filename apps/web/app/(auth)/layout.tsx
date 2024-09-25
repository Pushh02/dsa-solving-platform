import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">{children}</div>
  );
};

export default AuthLayout;