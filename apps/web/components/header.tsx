"use client"
import { useRecoilState } from "recoil";
import { runCode } from "@repo/store/submission";
import { UserButton } from "@clerk/nextjs";

const Header = () => {
  const [run, setRun] = useRecoilState(runCode);
  return (
    <nav className="flex text-white w-screen h-[9vh] bg-[#222222] px-2 items-center justify-between">
      <p className="text-3xl ml-4">CG</p>

      <div className="flex items-center justify-around w-fit h-fit border-gray-500 rounded-lg border-2">
        <div
          onClick={() => setRun(true)}
          className="hover:bg-[#2c2c2c] px-4 py-1 cursor-pointer rounded-l-lg"
        >
          Run
        </div>
        <hr className="text-white bg-white h-4 w-[1px]" />
        <div className="hover:bg-[#2c2c2c] px-4 py-1 cursor-pointer rounded-r-lg">
          Submit
        </div>
      </div>

      <div>
        <UserButton />
      </div>
    </nav>
  );
};

export default Header;
