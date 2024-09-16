import { useEffect, useRef } from "react";

const Donut = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let A = 0; // Rotation angle around the X-axis
    let B = 0; // Rotation angle around the Z-axis

    const screenWidth = 80;
    const screenHeight = 22;
    const output = new Array(screenWidth * screenHeight).fill(" ");
    const zBuffer = new Array(screenWidth * screenHeight).fill(0);

    const K1 = 15; // Distance scaling factor
    const K2 = 5; // Distance from the viewer to the donut

    const luminanceChars = ".,-~:;=!*#$@"; // Characters representing different luminance levels

    const render = () => {
      // Clear output and z-buffer
      for (let i = 0; i < screenWidth * screenHeight; i++) {
        output[i] = " ";
        zBuffer[i] = 0;
      }

      // Iterate over theta (angle around the donut's main axis)
      for (let j = 0; j < 6.28; j += 0.07) {
        // 0 to 2π
        const sinJ = Math.sin(j);
        const cosJ = Math.cos(j);

        // Iterate over phi (angle around the donut's tube)
        for (let i = 0; i < 6.28; i += 0.02) {
          // 0 to 2π
          const sinI = Math.sin(i);
          const cosI = Math.cos(i);
          const sinA = Math.sin(A);
          const cosA = Math.cos(A);
          const sinB = Math.sin(B);
          const cosB = Math.cos(B);

          const c = sinI;
          const d = cosJ;
          const e = sinA;
          const f = sinJ;
          const g = cosA;
          const h = d + 2; // Donut radius adjustment
          const D = 1 / (c * h * e + f * g + 5); // Depth factor
          const l = cosI;
          const m = cosB;
          const n = sinB;
          const t = c * h * g - f * e;

          // Projected 2D coordinates
          const x = Math.floor(40 + 30 * D * (l * h * m - t * n));
          const y = Math.floor(12 + 15 * D * (l * h * n + t * m));
          const o = x + screenWidth * y;

          // Calculate luminance
          const N = Math.floor(
            8 * ((f * e - c * d * g) * m - c * d * n - e * l * n) - Math.sin(A),
          );

          // Select luminance character
          const luminanceIndex = N > 0 ? N : 0;
          const clampedIndex =
            luminanceIndex < luminanceChars.length
              ? luminanceIndex
              : luminanceChars.length - 1;
          const char = luminanceChars[clampedIndex];

          // Ensure screen coordinates are within bounds
          if (
            y < screenHeight &&
            y >= 0 &&
            x >= 0 &&
            x < screenWidth &&
            D > zBuffer[o]
          ) {
            zBuffer[o] = D;
            output[o] = char;
          }
        }
      }

      // Convert the output buffer into a string with line breaks
      const outputString = output.join("");
      const formattedOutput = outputString.match(/.{1,80}/g).join("\n");

      // Update the pre element's content
      if (canvasRef.current) {
        canvasRef.current.textContent = formattedOutput;
      }

      // Increment rotation angles for animation
      A += 0.04;
      B += 0.02;

      // Request the next animation frame
      requestAnimationFrame(render);
    };

    // Start the animation
    render();

    // Cleanup function to stop the animation if the component unmounts
    return () => {};
  }, []);

  return (
    <pre
      ref={canvasRef}
      style={{
        color: "#FFFFFF", // White font
        fontFamily: "monospace",
        fontSize: "15px",
        textAlign: "center",
        lineHeight: "16px",
      }}
    ></pre>
  );
};

export default Donut;
