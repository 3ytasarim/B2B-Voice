import { Router } from "express";
import { checkAdminCredentials, createAdminToken } from "../lib/adminAuth";

const router = Router();

router.post("/admin/login", (req, res) => {
  const { username, password } = req.body ?? {};
  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "Validation error" });
    return;
  }
  if (!checkAdminCredentials(username, password)) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }
  res.json({ token: createAdminToken(username) });
});

export default router;
