"use client";

import { useEffect } from "react";

export default function ViewTracker({ id }) {
  useEffect(() => {
    if (id) {
      // Track view count
      fetch(`/api/views/${id}`, { method: "POST" });
      // Track unique visitor
      fetch(`/api/visitors/${id}`, { method: "POST" });
    }
  }, [id]);
  return null;
}
