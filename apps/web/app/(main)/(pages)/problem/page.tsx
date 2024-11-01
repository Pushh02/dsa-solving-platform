import Navbar from "@/components/navbar";
import ProblemList from "@/components/problem-page/problem-list";
import ProblemLoading from "@/components/problem-page/problem-loading";
import { initialProfile } from "@/lib/initial-profile";
import { Suspense } from "react";

const Page = async() => {
  await initialProfile();
  return (
    <div>
      <Navbar bgColor="bg-zinc-700" />
      <div className="flex">
        <aside className="w-[22vw] h-[91vh] bg-zinc-800 space-y-4">
          <p className="text-center my-4">Get started!</p>
          <div className="py-2 w-full border-b-2 border-t-2 cursor-default bg-zinc-800 hover:bg-zinc-600 border-gray-500 rounded-lg">
            <p className="text-center">Progress</p>
            <p className="text-[0.56rem] text-center">(in progress)</p>
          </div>
          <div className="py-2 w-full border-b-2 border-t-2 cursor-default bg-zinc-800 hover:bg-zinc-600 border-gray-500 rounded-lg">
            <p className="text-center">Socialize</p>
            <p className="text-[0.56rem] text-center">(in progress)</p>
          </div>
          <div className="py-2 w-full border-b-2 border-t-2 cursor-default bg-zinc-800 hover:bg-zinc-600 border-gray-500 rounded-lg">
            <p className="text-center">Chat</p>
            <p className="text-[0.56rem] text-center">(in progress)</p>
          </div>
          <div className="py-2 w-full border-b-2 border-t-2 cursor-default bg-zinc-800 hover:bg-zinc-600 border-gray-500 rounded-lg">
            <p className="text-center">Post</p>
            <p className="text-[0.56rem] text-center">(in progress)</p>
          </div>
        </aside>
        <div className="w-full mx-4">
          <h2 className="text-2xl p-4">All Problems</h2>
          <Suspense fallback={<ProblemLoading />}>
            <ProblemList />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Page;
