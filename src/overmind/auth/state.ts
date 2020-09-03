export interface AuthState {
  status: "idle" | "pending";
  error: string;
  isLoggedIn: boolean;
  currentUser: any;
}
export const state: AuthState = {
  status: "pending",
  isLoggedIn: false,
  currentUser: null,
  error: "",
};
