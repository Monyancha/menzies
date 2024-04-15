import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import getLogger from "../../../lib/shared/logger";
import GoogleProvider from "next-auth/providers/google";

const logger = getLogger("NextAuth");

export default NextAuth({
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Form Data
          const data = {
            name: profile?.name,
            email: profile?.email,
            avatar: profile?.picture,
            // Add other properties to the data object as needed
          };

          const response = await fetch(
            `${process.env.API_URL}/auth/google/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to send user data to the backend");
          }

          const result = await response.json();
          console.log("Response Data ", result);

          user = { ...result?.user };

          user["accessToken"] = result?.token;
        } catch (error) {
          console.error(error);
        }
      }

      // Persist the OAuth token to the token right after signin
      if (user) {
        // console.log("Credentials", token);
        // "first_name": "Global",
        // "last_name": "Admin",
        // "phone_number": "2541234560",
        // "role_id": 1,
        // "pass_number": "1234",
        // "status": 1,
        // "email": "globaladmin@menzies.com",
        const filteredUser = {
          name: user.first_name + ' ' + user.last_name,
          phone: user.phone_number,
          role_id: user.role_id,
          email: user.email,
          accessToken: user.accessToken,
          user_id: user.id,
        };
        // token.accessToken = user.token
        token = { ...token, ...filteredUser };
        console.log("the filtered value is " + filteredUser + 'token: ' + user);
      }
      return token;
    },

    async session({ session, token, user }) {
      // Send properties to the client, like an token from a provider.
      let customUser = { ...token };
      session = { user: customUser };
      console.log("Your session", session);
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        console.log("Monyancha 1 ", credentials);

        const accessToken = credentials.token ?? null;

        console.log("Monyancha 2 ",  accessToken);

        const body = JSON.stringify(credentials);
        logger.info("Authorizing: ", body);

        console.log("Monyancha 3 ",  body);

        if (!accessToken) {
          const resp = await fetch(`${process.env.API_URL}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body,
          })
            .then(async (response) => {
                console.log("Monyancha xx ",  response);
              let data = null;
              try {
                data = await response.json();
                console.log("Monyancha 5 ",  data);
              } catch (e) {
                data = await response.text();
                console.log("Monyancha 6 ",  data);
                throw data();
              }

              console.log("Monyancha 7 ",  data);

              logger.info("authorize", data);
              if (!response.ok) {
                if (response.status === 401) {
                  throw data;
                }
                throw JSON.stringify({ message: "Could not log you in" });
              }

              console.log("Monyancha 8 ",  data);

              return data;
            })
            .then((data) => {
              logger.info("Authorized: ", data);
              console.log("Monyancha 9 ",  data);
              return data;
            })
            .catch((error) => {
              console.log(error);
              if (error) {
                logger.warn("Unauthorized::UNCAUGHT ", error);
                throw new Error(error);
              }
              logger.warn("Unauthorized::OTHER ", error);
              throw new Error(error);
            });

            console.log("Monyancha 10 ",  resp);

          console.log("The Resp is" + resp);
          return {
            ...resp.user,
            accessToken: resp.token,
          };
        }

        // We have a token, try it out
        const resp = await fetch(`${process.env.API_URL}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accepts: "application/json",
            Authorization: `Bearer ${accessToken} `,
          },
        })
          .then(async (response) => {
            const data = await response.json();

            logger.info("authorize", data);
            if (!response.ok) {
              if (response.status === 401) {
                throw data;
              }
              throw { message: "Could not log you in" };
            }

            return data;
          })
          .then((data) => {
            logger.info("Authorized: ", data);
            return data;
          })
          .catch((error) => {
            console.log(error);
            if (error) {
              logger.warn("Unauthorized::UNCAUGHT ", error);
              throw new Error(error);
            }
            logger.warn("Unauthorized::OTHER ", error);
            throw new Error(error);
          });

        console.log("Auth body is ", resp);

        return {
          ...resp,
          accessToken,
        };
      },
    }),

    //GoogleProvider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});
