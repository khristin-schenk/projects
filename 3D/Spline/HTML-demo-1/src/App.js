import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import { Overlay } from "./Overlay";

export default function App() {
  const scroll = useRef(0);
  return (
    <>
      <Canvas shadows flat linear>
        <Suspense fallback={null}>
          <Scene scroll={scroll} />
        </Suspense>
      </Canvas>
      <Overlay scroll={scroll} />
    </>
  );
}
