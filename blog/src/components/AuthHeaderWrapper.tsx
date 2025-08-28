import { AuthProvider } from "./AuthProvider";
import { AuthNav } from "./AuthNav";

export const AuthHeaderWrapper: React.FC = () => {
  return (
    <AuthProvider>
      <AuthNav />
    </AuthProvider>
  );
};
