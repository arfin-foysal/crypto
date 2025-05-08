"use client";

import React from "react";
import { getStatusBadgeClass } from "@/constants/transaction";

const StatusBadge = ({ status }) => {
  const badgeClass = getStatusBadgeClass(status);
  
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${badgeClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
