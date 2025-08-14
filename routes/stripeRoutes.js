import { Router } from 'express';
import { createCheckoutSession, webhook } from '../controllers/stripeController.js';
import bodyParser from 'body-parser';

const router = Router();

router.post('/create-checkout-session', createCheckoutSession);

// Stripe webhook needs raw body
router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  (req, res, next) => { req.rawBody = req.body; next(); },
  webhook
);

export default router;
