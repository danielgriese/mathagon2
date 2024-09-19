import * as React from "react";

export const HEXAGON_WIDTH = 64;
export const HEXAGON_HEIGHT = 56;

export type HexagonProps = React.SVGProps<SVGGElement> & {
  // type: FieldType;
};

function Hexagon(
  { ...props }: React.SVGProps<SVGSVGElement>,
  ref: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      ref={ref}
      // 63 & 55.43
      //   viewBox="0 0 63 55.43"
      viewBox="0 0 64 56"
      paintOrder={"stroke"}
      //   capHeight={}
      // filter="drop-shadow(rgba(66,66,66,.5) 0 0 2px)"
      {...props}
      //   style="fill:none;stroke:#000000;stroke-width:2.5px"
    >
      {/* <path
        // TODO via CSS?
        // fill={type === null ? '#ddd' : '#fff'}
        d="M1 29.445q-1-1.732 0-3.464L15 1.732Q16 0 18 0h28q2 0 3 1.732l14 24.249q1 1.732 0 3.464L49 53.694q-1 1.732-3 1.732H18q-2 0-3-1.732z"
      /> */}
      <path
        d="m47.7 55.4h-31.4l-15.6-27.4 15.6-27.4h31.4l15.6 27.4z"
        // style={{ strokeLinejoin: "miter" }}
      />
      {props.children}
    </svg>
  );
}

export default React.forwardRef(Hexagon);
