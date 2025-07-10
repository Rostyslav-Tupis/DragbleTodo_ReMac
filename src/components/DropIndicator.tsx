import { type FC } from "react";
import styles from "@/styles/dropIdicator.module.css";

interface DropIndicatorProps {
  edge: "top" | "bottom" | "right" | "left";
  gap: string;
}

const DropIndicator: FC<DropIndicatorProps> = ({ edge, gap }) => {
  const style = {
    "--gap": gap,
    [edge]: "calc(-1 * var(--gap))",
  } as React.CSSProperties;

  return (
    <div className={`${styles.dropIndicator} ${styles[edge]}`} style={style} />
  );
};

export default DropIndicator;
