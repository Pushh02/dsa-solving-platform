import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { currentProfile } from "@/lib/current-profile";

interface NavbarProps {
  bgColor?: "bg-zinc-700";
}

const Navbar = async({ bgColor }: NavbarProps) => {
  const profile = await currentProfile();

  return (
    <nav className={cn("p-4", bgColor ? bgColor : "bg-white")}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href={"/"} className="text-customGreen text-lg font-bold cursor-default">Coding Genius</Link>
      
        {/* Menu for larger screens */}
        <div className={cn("hidden md:flex space-x-6", bgColor ? "text-white" : "text-black")}>
          <Link
            href="/problem"
            className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-customGreen after:w-0 after:transition-width after:duration-300 hover:after:w-full"
          >
            Problem
          </Link>
          <Link
            href="/aboutus"
            className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-customGreen after:w-0 after:transition-width after:duration-300 hover:after:w-full"
          >
            Guided List
          </Link>
          <Link
            href="/aboutus"
            className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-customGreen after:w-0 after:transition-width after:duration-300 hover:after:w-full"
          >
            About Us
          </Link>
          <Link
            href="https://github.com/Pushh02/dsa-solving-platform"
            className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-customGreen after:w-0 after:transition-width after:duration-300 hover:after:w-full"
          >
            Contribute
          </Link>
        </div>

        {profile ? <UserButton /> : (
          <Link href={"/sign-in"} className="py-1 px-3 bg-gradient-to-br from-customGreen to-[#27be3b] text-white rounded-lg mr-1">
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
};

// Export the Navbar component with dynamic import to avoid SSR
// export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
export default Navbar;
