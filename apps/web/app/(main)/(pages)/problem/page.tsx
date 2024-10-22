import ProblemList from "@/components/problem-page/problem-list";

const Page = () => {

    return ( 
        <div>
            <nav className="h-[9vh] bg-zinc-700"></nav>
            <div className="flex">
                <aside className="w-[22vw] h-[91vh] bg-zinc-800"></aside>
                    <ProblemList />
            </div>
        </div>
     );
}
 
export default Page;