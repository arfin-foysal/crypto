import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // If the path is exactly '/', redirect to '/home'
  if (path === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Redirect login and signup routes to home page
  if (path === "/login" || path === "/signup") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Continue with the request for all other paths
  return NextResponse.next();
}

// Configure the paths that should be handled by this middleware
export const config = {
  matcher: ["/", "/login", "/signup"],
};
