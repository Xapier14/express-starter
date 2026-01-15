import { Router } from "express";

const router = Router();
/**
 * @openapi
 * /hello-world:
 *  get:
 *    tags:
 *      - Hello World
 *    summary: Greet the user
 *    responses:
 *      200:
 *        description: Tells whether the user is logged in or not
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 */
router.get("/", (req, res) => {
  const { session, currentUser } = req;

  if (!session || !currentUser) {
    return res.send("Hello world! You are not logged in.");
  }

  res.send(`Hello ${currentUser.email}`);
});

export default router;
