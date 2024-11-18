import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // Access the token value
  const userDataCookie = request.cookies.get("user")?.value; // Access the user data value\

  


  if (!token || !userDataCookie) {
    return NextResponse.redirect(new URL("/notadmin", request.url));
  }

  let userData;
  try {
    userData = JSON.parse(userDataCookie); // Parse the user data from the cookie
  } catch (error) {
    console.error("Invalid user data in cookie:", error);
    return NextResponse.redirect(new URL("/notadmin", request.url));
  }
  if (!isAdmin(userData.rol)) {
    return NextResponse.redirect(new URL("/notadmin", request.url));
  }

  return NextResponse.next();
}

function isAdmin(rol: string) {
  return rol === "admin";
}

export const config = {
    matcher: ["/admin/:path*"], // Applies middleware to all routes
};
