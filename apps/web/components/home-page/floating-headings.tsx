"use client";
import { CircleDot } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FloatingHeadingProps {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  title: string;
  description: string;
  delay: string;
}

const FloatingHeading = ({
  top,
  right,
  bottom,
  left,
  title,
  description,
  delay
}: FloatingHeadingProps) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad && divRef.current) {
        if (divRef.current) {
          divRef.current.style.transition = `all ${delay}s cubic-bezier(0.4, 0, 0.2, 1)`;
          setIsInitialLoad(false);
        }
    }
    if(divRef.current){
      const handleMouseMove = (event: MouseEvent) => {
        const percentX = (event.clientX / window.innerWidth) * 100;
        const percentY = (event.clientY / window.innerHeight) * 100;
        if (divRef.current) {
          const elementWidth = divRef.current.offsetWidth;
          const elementHeight = divRef.current.offsetHeight;
          const offsetX = (elementWidth / window.innerWidth) * 100;
          const offsetY = (elementHeight / window.innerHeight) * 100;
  
          divRef.current.style.top = `${percentY - offsetY}%`;
          divRef.current.style.left = `${percentX - offsetX}%`;
        }
      };
      window.addEventListener("mousemove", handleMouseMove);
  
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isInitialLoad]);
  return (
    <div
      className="w-20 h-fit absolute p-7"
      style={{ top, right, bottom, left }}
    >
      <div className="h-7 relative">
        <div
          ref={divRef}
          style={{
            transform: 'translate(-50%, -50%)',
            willChange: 'top, left',
          }}
          className="group py-1 ml-10 w-52 absolute whitespace-nowrap bg-gradient-to-r from-[#62BD5399] to-[#27265799] rounded-md pr-2 cursor-default"
        >
          <div className="flex items-center">
            <CircleDot className="h-4" />{" "}
            <p className="font-semibold text-sm">{title}</p>
          </div>
          <div className="max-h-0 group-hover:max-h-24 transition-all duration-300 ease-in-out w-fit whitespace-normal text-sm mx-2">
            <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingHeading;
