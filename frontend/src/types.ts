export interface UserProfile 
{
  id: string;
  fullName: string;
  email: string;
  balance: number;
}

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;

  registerUser: (fullName: string, email: string, password: string) => { success: boolean; message: string };
  loginUser: (email: string, password: string) => { success: boolean; message: string };
    logoutUser: () => void;
  updateBalance: (amount: number) => void;
}
