import { cn } from "@/lib/utils";
import { CircleDot } from "lucide-react";

interface FloatingHeadingProps {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  title: string;
  description: string;
}

const FloatingHeading = ({
  top,
  right,
  bottom,
  left,
  title,
  description,
}: FloatingHeadingProps) => {
  return (
    <div
      className={cn(
        "w-fit h-7 flex items-center absolute bg-gradient-to-r from-[#62BD5399] to-[#27265799] rounded-md pr-2 cursor-default",
      )}
      style={{top, right, bottom, left}}
    >
      <CircleDot className="h-4" />{" "}
      <p className="font-semibold text-sm">{title}</p>
    </div>
  );
};

export default FloatingHeading;
