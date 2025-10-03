import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./page";

global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] }) as any;

test("renderiza UI básica", async () => {
  render(<Home />);
  expect(screen.getByText(/Refrescar/i)).toBeInTheDocument();
  expect(screen.getByText(/Crear evento de prueba/i)).toBeInTheDocument();
  expect(await screen.findByText(/Sin eventos aún/i)).toBeInTheDocument();
});
