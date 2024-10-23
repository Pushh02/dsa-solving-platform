import Navbar from "@/components/navbar";
import ProblemList from "@/components/problem-page/problem-list";

const Page = () => {
  return (
    <div>
      <Navbar bgColor="bg-zinc-700" />
      <div className="flex">
        <aside className="w-[22vw] h-[91vh] bg-zinc-800 space-y-4">
          <p className="text-center my-4">Get started!</p>
          <div className="py-2 w-full border-b-2 border-t-2 cursor-default bg-zinc-800 hover:bg-zinc-600 border-gray-500 rounded-lg">
            <p className="text-center">Progress</p>
          </div>
          <div className="py-2 w-full border-b-2 border-t-2 cursor-default bg-zinc-800 hover:bg-zinc-600 border-gray-500 rounded-lg">
            <p className="text-center">Socialize</p>
          </div>
          <div className="py-2 w-full border-b-2 border-t-2 cursor-default bg-zinc-800 hover:bg-zinc-600 border-gray-500 rounded-lg">
            <p className="text-center">Chat</p>
          </div>
          <div className="py-2 w-full border-b-2 border-t-2 cursor-default bg-zinc-800 hover:bg-zinc-600 border-gray-500 rounded-lg">
            <p className="text-center">Post</p>
          </div>
        </aside>
        <div className="w-full mx-4">
          <h2 className="text-2xl p-4">All Problems</h2>
          <ProblemList />
        </div>
      </div>
    </div>
  );
};

export default Page;
