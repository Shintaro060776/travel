const express = require("express");
const app = express();

const PORT = 3000;
// const stripe = require("stripe")('sk_test_51NpSNfGaswHXtpK8xKvRWvuED6aQeiTcooMBKMz5VEDpR6EVaprP0EoUZn7bf6u3sNsT8oYQYlnFDrwDRngWUFLj00rn88pdCw');
const stripe = require("stripe")('sk_test_51NpSNfGaswHXtpK8xKvRWvuED6aQeiTcooMBKMz5VEDpR6EVaprP0EoUZn7bf6u3sNsT8oYQYlnFDrwDRngWUFLj00rn88pdCw');

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const YOUR_DOMAIN = "https://localhost:3000";

app.post("/create-checkout-session", async (req, res) => {
    try {
        const prices = await stripe.prices.list({});
        console.log(prices);
        const session = await stripe.checkout.sessions.create({
            billing_address_collection: "auto",
            line_items: [
                {
                    price: prices.data[0].id,
                    // For metered billing, do not pass quantity
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/cancel.html`,
        });

        res.redirect(303, session.url);
    } catch (err) {
        console.log(err);
    }
});

app.listen(PORT, console.log("サーバーが起動しました"));