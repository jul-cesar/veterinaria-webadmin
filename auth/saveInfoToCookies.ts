import { userData } from "@/types/userdata";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export const saveInfoToCookies = (token: string, user: userData) => {
  Cookies.set("token", token, { secure: true, sameSite: "strict" });
  Cookies.set("user", JSON.stringify(user), {
    secure: true,
    sameSite: "strict",
  });
};

export const clearCookies = () => {
  Cookies.remove("token");
  Cookies.remove("user");
  redirect('/login')
};
