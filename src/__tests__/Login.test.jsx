import React from "react";
import { render } from "@testing-library/react";
import { useAuthContext } from "../context/authContext";

import Login from "../components/login/Login";

jest.mock("../context/authContext", () => ({
  useAuthContext: jest.fn(),
}));

describe("Login component", () => {
  test("renders without error", () => {
    useAuthContext.mockReturnValue({ userToken: null });
    render(<Login />);
  });

  test("displays login form", () => {
    useAuthContext.mockReturnValue({ userToken: null });
    const { getByRole } = render(<Login />);
    const form = getByRole("form");
    expect(form).toBeInTheDocument();
  });

  test("displays logged in message if user is already logged in", () => {
    useAuthContext.mockReturnValue({ userToken: "some_token" });
    const { getByText } = render(<Login />);
    const message = getByText("You are already logged in.");
    expect(message).toBeInTheDocument();
  });

  test("displays dashboard link if user is already logged in", () => {
    useAuthContext.mockReturnValue({ userToken: "some_token" });
    const { getByRole } = render(<Login />);
    const link = getByRole("link", { name: "Go to dashboard" });
    expect(link).toBeInTheDocument();
  });
});
