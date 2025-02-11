import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        // Mock admin user (Replace this with a database check in the future)
        const adminUser = {
          id: "1",
          name: "Admin",
          email: "admin@shop.co",
          password: await bcrypt.hash("admin123", 10),
          image: "/default-avatar.png",
        };

        const isValid = await bcrypt.compare(credentials.password, adminUser.password);
        if (credentials.email === adminUser.email && isValid) {
          return adminUser;
        }

        throw new Error("Invalid email or password");
      },
    }),
  ],
  pages: { signIn: "/" },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.image;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
