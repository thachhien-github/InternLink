import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import * as authHook from "../hooks/useAuth";
import React from "react";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const renderWithRouter = (initialPath: string, allowedRoles?: authHook.UserRole[]) => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/change-password" element={<div>Change Password Page</div>} />
          <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
          <Route path="/lecturer/dashboard" element={<div>Lecturer Dashboard</div>} />
          <Route path="/student/dashboard" element={<div>Student Dashboard</div>} />
          
          <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
            <Route path="/protected-area" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
  };

  it("redirects unauthenticated user to /login", () => {
    vi.spyOn(authHook, "useAuth").mockReturnValue({
      isLoggedIn: false,
      isBootstrapping: false,
      user: null,
      role: null,
      mustChangePassword: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshMe: vi.fn(),
      clearMustChangePassword: vi.fn(),
      switchRole: vi.fn(),
    });

    renderWithRouter("/protected-area");
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).toBeNull();
  });

  it("redirects to /change-password when user must change password", () => {
    vi.spyOn(authHook, "useAuth").mockReturnValue({
      isLoggedIn: true,
      isBootstrapping: false,
      user: { id: "1", username: "admin", name: "Admin", role: "admin" },
      role: "admin",
      mustChangePassword: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshMe: vi.fn(),
      clearMustChangePassword: vi.fn(),
      switchRole: vi.fn(),
    });

    renderWithRouter("/protected-area", ["admin"]);
    expect(screen.getByText("Change Password Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).toBeNull();
  });

  it("redirects user to their role dashboard when accessing unauthorized role route", () => {
    vi.spyOn(authHook, "useAuth").mockReturnValue({
      isLoggedIn: true,
      isBootstrapping: false,
      user: { id: "2", username: "student1", name: "Student One", role: "student" },
      role: "student",
      mustChangePassword: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshMe: vi.fn(),
      clearMustChangePassword: vi.fn(),
      switchRole: vi.fn(),
    });

    // Student trying to access admin-only area
    renderWithRouter("/protected-area", ["admin"]);
    expect(screen.getByText("Student Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).toBeNull();
  });

  it("renders protected content when user has allowed role", () => {
    vi.spyOn(authHook, "useAuth").mockReturnValue({
      isLoggedIn: true,
      isBootstrapping: false,
      user: { id: "3", username: "lecturer1", name: "Lecturer One", role: "lecturer" },
      role: "lecturer",
      mustChangePassword: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshMe: vi.fn(),
      clearMustChangePassword: vi.fn(),
      switchRole: vi.fn(),
    });

    renderWithRouter("/protected-area", ["lecturer"]);
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
