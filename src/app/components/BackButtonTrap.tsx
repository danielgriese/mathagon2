"use client";
import React, { PropsWithChildren, useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { useRouter } from "next/navigation";

export type BackButtonTrapProps = PropsWithChildren;

export const BackButtonTrap: React.FC<BackButtonTrapProps> = (props) => {
  const router = useRouter();

  useEffect(() => {
    CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else {
        router.back();
      }
    });
  }, [router]);

  return props.children;
};
