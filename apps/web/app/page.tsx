import Navbar from "@/components/navbar";
import { initialProfile } from "@/lib/initial-profile";
import Image from "next/image";
// import { UserButton, UserProfile } from "@clerk/nextjs";

const Home = async () => {
  const profile = await initialProfile();
  const { id } = profile;
  console.log(id);
  return (
    <div>
      <Navbar />
      <div className="bg-white">
        <section className="bg-yellow-50 text-black flex flex-col md:flex-row">
          {/* 70% Column */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-left">
              <h6 className="text-4xl md:text-6xl font-bold mb-4">Coding Genius</h6>
              <p className="text-md md:text-lg mb-8">
                Unlock your potential with our coding challenges and guided resources.
                Unlock your potential with our coding challenges and guided resources.
              </p>
            </div>
          </div>

          {/* 30% Column */}
          <div className="flex-shrink-0 w-full md:w-1/3 flex items-center justify-center p-6">
            <Image
              src="assets/images/hero.png"
              alt="Coding Genius"
              className="w-full max-w-[300px] h-auto"
            />
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
