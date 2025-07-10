import { forwardRef, memo, type ReactNode } from "react";
import styles from "@/styles/default-styles/default-styles.module.css";

interface CustomButtonProps extends React.ComponentProps<"button"> {
  children: ReactNode;
  className?: string;
}

export const CustomButton = memo(
  forwardRef<HTMLButtonElement, CustomButtonProps>(
    ({ children, className, ...restProps }, ref) => {
      return (
        <button
          ref={ref}
          className={`${styles.customButton} ${className}`.trim()}
          {...restProps}
        >
          {children}
        </button>
      );
    }
  )
);
