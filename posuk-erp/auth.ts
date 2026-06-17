import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendLoginAlert } from "@/lib/email";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      fullName: string;
      role: string;
      roleId: string;
      branchId: string;
      branchName: string;
    };
  }
  interface User {
    id: string;
    username: string;
    fullName: string;
    role: string;
    roleId: string;
    branchId: string;
    branchName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    fullName: string;
    role: string;
    roleId: string;
    branchId: string;
    branchName: string;
  }
}

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: { username: { type: "text" }, password: { type: "password" } },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) return null;
        const user = await db.user.findUnique({
          where: { username: credentials.username as string },
          include: { role: true, branch: true },
        });
        if (!user || user.status !== "Active") return null;
        const ok = await bcrypt.compare(credentials.password as string, user.passwordHash);
        if (!ok) return null;
        await db.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
        void sendLoginAlert(user).catch(() => {});
        return {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role.name,
          roleId: user.roleId,
          branchId: user.branchId,
          branchName: user.branch.name,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) Object.assign(token, user);
      return token;
    },
    async session({ session, token }) {
      session.user = { id: token.id, username: token.username, fullName: token.fullName, role: token.role, roleId: token.roleId, branchId: token.branchId, branchName: token.branchName };
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
