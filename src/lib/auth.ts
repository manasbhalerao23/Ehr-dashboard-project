import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Add your authentication logic here
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      return token;
    },
    async session({ session, token }) {
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
});