"use client";

import { LoaderCircle } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <LoaderCircle className="animate-spin size-10" />
    </div>
  );
};

export default loading;
