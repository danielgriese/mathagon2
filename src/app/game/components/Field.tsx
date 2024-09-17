import React from "react";

export type FieldProps = unknown;

export const Field: React.FC<FieldProps> = (props) => {
  return (
    <div>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
};
