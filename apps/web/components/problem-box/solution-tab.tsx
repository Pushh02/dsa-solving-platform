import { solutionSchema } from "@repo/db/types";

const SolutionTab = ({ solution }: { solution: solutionSchema | null }) => {
  return (
    <div className="m-4">
      <h2 className="text-2xl mb-2 font-semibold">Solution</h2>
      {solution !== null && (
        <div>
          <p>
            Explaination:{" "}
            <span className="text-sm leading-7">{solution.explaination}</span>
          </p>
          <p>
            Code: <br />{" "}
            <p className="font-mono bg-gray-800 p-3 text-sm rounded-lg">
              {solution.code}
            </p>
          </p>
          <p className="">Explaination Video:</p>
          <iframe
            width="400"
            height="250"
            className="mx-auto"
            src={solution.videoLink}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default SolutionTab;
