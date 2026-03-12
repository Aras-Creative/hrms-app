import React from "react";

export const BackofficePages = {
  Leaves: React.lazy(() => import("@backoffice/leaves/pages/leaves")),
};

import { Suspense } from "react";
import { RouteObject } from "react-router-dom";

export const adminRoutes: RouteObject[] = [
  {
    path: "/dashboard/leaves",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BackofficePages.Leaves />
      </Suspense>
    ),
  },
];
