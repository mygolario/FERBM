import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Configure robust environment fallbacks for NextAuth v5 (Auth.js)
if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = process.env.NEXTAUTH_SECRET || process.env.PAYLOAD_SECRET || "ferbm_placeholder_secret_key";
}
if (!process.env.NEXTAUTH_URL && process.env.NEXT_PUBLIC_SITE_URL) {
  process.env.NEXTAUTH_URL = process.env.NEXT_PUBLIC_SITE_URL;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "OTP and Email Login",
      credentials: {
        phone: { label: "شماره تلفن", type: "text" },
        otp: { label: "کد تایید", type: "text" },
        email: { label: "ایمیل", type: "text" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // 1. Phone + OTP flow
        if (credentials.phone) {
          const phone = credentials.phone as string;
          const otp = credentials.otp as string;

          // Mock verification for development: Accept any 4-digit code (e.g. '1234')
          if (otp && otp.length >= 4) {
            return {
              id: phone,
              name: "هنردوست فربم",
              email: `${phone}@ferbm.com`,
              phone: phone,
            };
          }
          return null;
        }

        // 2. Email + Password flow
        if (credentials.email && credentials.password) {
          const email = credentials.email as string;
          const password = credentials.password as string;

          // Standard admin demo fallback
          if (email === "artist@ferbm.com" && password === "ferbm2026") {
            return {
              id: "artist-admin",
              name: "هنرمند فربم (مدیر)",
              email: "artist@ferbm.com",
              role: "admin",
            };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = (user as any).phone;
        token.role = (user as any).role || "customer";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).phone = token.phone;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/account",
  },
  secret: process.env.PAYLOAD_SECRET || "ferbm_placeholder_secret_key",
});
