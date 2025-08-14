import Stripe from 'stripe';
import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import Workshop from '../models/Workshop.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId).populate('workshop');
  if (!booking) { res.status(404); throw new Error('Booking not found'); }
  if (booking.status === 'paid') { return res.json({ url: `${process.env.CLIENT_URL}/dashboard?paid=1` }); }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `${process.env.CLIENT_URL}/dashboard?success=1`,
    cancel_url: `${process.env.CLIENT_URL}/workshops/${booking.workshop._id}?cancel=1`,
    line_items: [{
      price_data: {
        currency: 'inr',
        product_data: { name: booking.workshop.title, description: 'Workshop booking' },
        unit_amount: Math.round(booking.amountINR * 100)
      },
      quantity: 1
    }],
    metadata: {
      bookingId: booking._id.toString(),
      userId: booking.user.toString(),
      workshopId: booking.workshop._id.toString()
    }
  });

  booking.stripeSessionId = session.id;
  await booking.save();

  res.json({ url: session.url });
});

export const webhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = new Stripe.Webhook(process.env.STRIPE_WEBHOOK_SECRET).constructEvent(
      req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, { status: 'paid' });
    }
  }

  res.json({ received: true });
});
