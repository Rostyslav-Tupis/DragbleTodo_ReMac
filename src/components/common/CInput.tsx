import React, { forwardRef, memo } from "react";
import styles from "@/styles/default-styles/default-styles.module.css";

interface CustomInputProps extends React.ComponentProps<"input"> {
  className?: string;
}

export const CustomInput = memo(
  forwardRef<HTMLInputElement, CustomInputProps>(
    ({ className = "", ...rest }, ref) => {
      return (
        <input
          ref={ref}
          {...rest}
          className={`${styles.custom_input} ${className}`.trim()}
        />
      );
    }
  )
);
