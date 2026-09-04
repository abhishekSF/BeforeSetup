import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});


vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
}));

vi.mock("next/og", () => ({
  ImageResponse: class ImageResponse {
    element: React.ReactNode;
    options: { width: number; height: number };
    constructor(
      element: React.ReactNode,
      options: { width: number; height: number }
    ) {
      this.element = element;
      this.options = options;
    }
  },
}));

vi.mock("next/navigation", async () => {
  const { routerPush } = await import("./router-mock");
  return {
    useRouter: () => ({ push: routerPush }),
    notFound: () => {
      throw new Error("NEXT_NOT_FOUND");
    },
  };
});

vi.mock("next/link", () => ({
  default: function MockLink({
    href,
    children,
    ...rest
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return React.createElement("a", { href, ...rest }, children);
  },
}));
