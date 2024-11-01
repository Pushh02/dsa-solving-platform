import { currentUser, auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  try {
    if (user) {
      const profile = await db.profile.findUnique({
        where: {
          id: user.id,
        },
      });

      if (profile) {
        return profile;
      }

      const getRandomInt = (max: number) => {
        return Math.floor(Math.random() * max);
      };

      const newProfile = await db.profile.create({
        data: {
          id: user.id,
          username:
            user.username || `${user.firstName}${getRandomInt(1000000)}`,
          name: `${user.firstName} ${user.lastName}`,
          imageURL: user.imageUrl,
          //@ts-ignore
          email: user.emailAddresses[0].emailAddress,
        },
      });
      return newProfile;
    }
  } catch (err) {
    console.log(err);
  }

  return null;
};
