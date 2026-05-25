"use client";

import { useEffect } from "react";

export default function ViewTracker({ id }) {
  useEffect(() => {
    if (id) fetch(`/api/views/${id}`, { method: "POST" });
  }, [id]);
  return null;
}
