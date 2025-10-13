import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Header } from "./header.ui";

describe("Header Component", () => {
  it("renders site title", () => {
    render(<Header />);
    expect(screen.getByText(/my blog/i)).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /blog/i })).toHaveLength(2); // Brand link also contains "blog"
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
  });

  it("has proper semantic structure", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders brand link", () => {
    render(<Header />);
    const brandLink = screen.getByRole("link", { name: /my blog/i });
    expect(brandLink).toHaveAttribute("href", "/");
  });
});
