"use client";

const ProblemBox = () => {
  return (
    <div className="h-[89vh] w-[47vw] border-[1px] rounded-lg border-slate-400 p-4 overflow-auto">
      <h1 className="text-3xl font-semibold">1. 2Sum</h1>
      <div className="text-[#d1d1d1] text-md mt-2">
        <p className="leading-9">
          Given an array of integers nums and an integer target, return indices
          of the two numbers such that they add up to target. You may assume
          that each input would have exactly one solution, and you may not use
          the same element twice. You can return the answer in any order.
        </p>
        <p>
          Example 1: <br /> <br />
          Input: nums = [2,7,11,15], target = 9 Output: [0,1] Explanation:
          Because nums[0] + nums[1] == 9, we return [0, 1]. <br />
          Example 2:
          <br />
          <br />
          Input: nums = [3,2,4], target = 6<br />
          Output: [1,2]
          <br />
          Example 3:
          <br />
          <br />
          Input: nums = [3,3], target = 6 Output: [0,1]
        </p>
        Constraints: <br />
        {"2 <= nums.length <= 104"}
        <br />
        {"-109 <= nums[i] <= 109"}
        <br />
        {"-109 <= target <= 109"}
        <br />
        Only one valid answer exists. Follow-up: Can you come up with an
        algorithm that is less than O(n2) time complexity?
      </div>
    </div>
  );
};

export default ProblemBox;
