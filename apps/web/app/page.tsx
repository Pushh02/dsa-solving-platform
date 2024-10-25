import Navbar from "@/components/navbar";
import { initialProfile } from "@/lib/initial-profile";
import Image from "next/image";
import FloatingHeading from "@/components/home-page/floating-headings";

//Image imports
import heroImg from "../public/assets/images/hero.png";
import Svg1 from "../public/assets/images/svg1.svg";
import SillyEmoji from "../public/assets/images/silly-img.png";
import Arrow from "../public/assets/images/arrow.png";

const Home = async () => {
  await initialProfile();
  return (
    <div className="bg-[#D7D7D7] h-screen w-screen">
      <Navbar />
      <section className="text-black flex flex-col md:flex-row">
        {/* 70% Column */}
        <div className="p-6 bg-dotedBg bg-cover">
          <div className="text-left mt-8 ml-8">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              Coding{" "}
              <span className="bg-gradient-to-br from-[#64d652] via-[#86aa88] to-[#3b6e31] text-transparent bg-clip-text">
                Genius
              </span>
            </h1>
            <h2 className="text-sm md:text-lg mb-8">
              Unlock your potential with our coding challenges and guided
              resources. Unlock your potential with our coding challenges and
              guided resources.
            </h2>
          </div>
          <div className="w-full h-[25vh] relative">
            <FloatingHeading
              top="-20%"
              right="30%"
              delay="0.4"
              title="Guided DSA questions"
              description="Unlock your potential with our coding challenges and guided resources."
            />
            <FloatingHeading
              top="4%"
              left="3%"
              delay="0.5"
              title="Guided DSA questions"
              description="Unlock your potential with our coding challenges and guided resources."
            />
            <FloatingHeading
              bottom="-8%"
              left="14%"
              delay="0.7"
              title="Guided DSA questions"
              description="Unlock your potential with our coding challenges and guided resources."
            />
            <FloatingHeading
              bottom="10%"
              right="25%"
              delay="0.6"
              title="Guided DSA questions"
              description="Unlock your potential with our coding challenges and guided resources."
            />
          </div>
        </div>

        {/* 30% Column */}
        <div className="flex-shrink-0 w-full md:w-1/3 xl:w-1/4 flex items-center justify-center p-6">
          <div className="relative">
            <div className="absolute top-[40%] left-[30%]">
              <p className="font-bold text-white -ml-4">
                You after joining this platform
              </p>
              <Image src={Arrow} alt="img" height={60} width={60} />
            </div>
            <Image
              src={heroImg}
              alt="Coding Genius"
              width={200}
              height={100}
              className="w-full max-w-[300px] h-auto rounded-md"
            />
          </div>
        </div>
      </section>
      <Image
        className="absolute bottom-0 left-0 h-[18%] w-[56%]"
        src={Svg1}
        alt="svg"
        height={500}
        width={500}
      />
      <div className="absolute bottom-10 right-10 flex items-center text-black font-semibold">
        <Image src={SillyEmoji} alt="img" height={60} width={60} />
        <p className="text-md">Please Join</p>
      </div>
    </div>
  );
};

export default Home;
