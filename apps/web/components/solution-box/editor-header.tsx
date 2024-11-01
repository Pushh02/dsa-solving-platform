"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { language } from "@repo/store/submission";

const EditorHeader = () => {
  const [lang, setLang] = useState("cpp");
  const setRecoilLang = useSetRecoilState(language);

  useEffect(()=>{
    setRecoilLang(lang);
  },[lang])
  
  return (
    <div className="w-full h-7 border-b-[1px] border-t-[1px] border-[#3d3d3d] flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-md font-semibold px-3 ml-2 rounded-md focus:outline-0 flex items-center h-6 border-[1px] border-[#5f5f5f] border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
            {lang}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit px-2 py-3 rounded-lg space-y-1 text-sm font-medium bg-[#292929] border-[1px] border-[#b8b8b8] text-black dark:text-neutral-400 space=y-[2px]">
          <DropdownMenuLabel>Languages</DropdownMenuLabel>
          <hr />
          <DropdownMenuItem
            onClick={() => {
              setLang("cpp");
            }}
            className="hover:bg-[#202020] cursor-pointer"
          >
            c++
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            onClick={() => {
              setLang("java");
            }}
            className="hover:bg-[#202020] cursor-pointer"
          >
            java
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setLang("python");
            }}
            className="hover:bg-[#202020] cursor-pointer"
          >
            python
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setLang("javascript");
            }}
            className="hover:bg-[#202020] cursor-pointer"
          >
            javascript
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default EditorHeader;
