import { AuthContext, type AuthUser } from "../context/AuthContext";


const MOCK_USER: AuthUser = {
  id: "user-shelter-001",
  role: "shelter",
  shelter_id: "29f6c1a2-0b4f-4561-ae65-8c3664096385",
};
// 1. Reemplazar MOCK_USER por el usuario que venga de Supabase/JWT
// 2. Mantén la misma forma del objeto AuthUser
export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AuthContext.Provider value={{ user: MOCK_USER }}>
      {children}
    </AuthContext.Provider>
  );
};