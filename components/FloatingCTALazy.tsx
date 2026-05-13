"use client";

import dynamic from "next/dynamic";

// FloatingCTA's only behaviours are scroll-triggered (visibility at >300px)
// and mouseleave-triggered (exit-intent modal). Neither matters at first
// paint — keep them out of the initial JS by ssr:false dynamic-loading the
// real component. This file is a client-component boundary so the
// `dynamic()` call (which doesn't support ssr:false in server components)
// works correctly.
const FloatingCTA = dynamic(() => import("./FloatingCTA"), { ssr: false });

export default function FloatingCTALazy() {
  return <FloatingCTA />;
}
