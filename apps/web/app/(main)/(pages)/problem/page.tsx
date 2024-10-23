import Navbar from "@/components/navbar";
import ProblemList from "@/components/problem-page/problem-list";

const Page = () => {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <aside className="w-[22vw] h-[91vh] bg-zinc-800"></aside>
        <ProblemList />
      </div>
    </div>
  );
};

export default Page;
