import { currentUser, auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    const absoluteUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/sign-in`;
    return auth().redirectToSignIn({ returnBackUrl: absoluteUrl });
  }

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
  }

  const newProfile = await db.profile.create({
    data: {
      id: user.id,
      username: user.username || `${user.firstName}${getRandomInt(10000)}`,
      name: `${user.firstName} ${user.lastName}`,
      imageURL: user.imageUrl,
      //@ts-ignore
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};
