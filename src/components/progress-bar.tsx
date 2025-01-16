import { FC } from "react";

export const ProgressBar: FC<{ percentage: number }> = ({ percentage }) => {
  return (
    <div className="overflow-hidden rounded-full bg-lightGray">
      <div style={{ width: `${percentage * 100}%` }} className="h-2 rounded-full bg-blue" />
    </div>
  );
};
