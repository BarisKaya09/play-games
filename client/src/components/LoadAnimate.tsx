import React, { useEffect, useRef } from "react";
import { loadWithAnim, type AnimType } from "./ui";

type LoadAnimateProps = {
  children: any;
  atype: AnimType;
  duration: number;
};
const LoadAnimate: React.FC<LoadAnimateProps> = ({ children, atype, duration }) => {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (elRef.current) loadWithAnim(elRef.current, atype, duration);
  }, []);

  return (
    <div className="opacity-0" ref={elRef}>
      {children}
    </div>
  );
};

export default LoadAnimate;
