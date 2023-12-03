import { Router } from "express";
import Tickets from "../../dao/dbManager/ticketManager.js";

const router = Router();
const ticketManager= new Tickets();

router.get("/:tid", async (req, res) => {
    const tid=req.params.tid;
    console.log(tid)
    const ticket= await ticketManager.getById(tid)
  res.render("ticket", {
    ticket: ticket
  });
});

export default router;