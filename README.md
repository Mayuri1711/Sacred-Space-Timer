## **Inspiration**

In a world filled with noise and digital clutter, we craved a moment of intentional stillness—a digital sanctuary where users could simply breathe, reflect, and reset. The idea was to create a calming space that felt sacred, meditative, and meaningful, yet built with pure simplicity.

---

## **What it does**

**Sacred Space Timer** invites users to type a short intention and choose a duration (1–10 minutes). Upon starting, a soft gong sounds, the screen fades to darkness, and a flickering candle or incense animation plays. The entire interface disappears—leaving only the animation. At the end, another gong chimes, the user’s intention reappears with a randomly chosen calming quote, gently closing the session.

---

## **How we built it (in one prompt)**

We used a **single prompt to ChatGPT** to generate the entire fullscreen, offline-friendly web app using only **HTML**, **CSS**, and **vanilla JavaScript**. No libraries. No frameworks. No backend. The prompt described the desired experience in natural language, and the AI delivered a fully functional meditative timer with:

* Clean UI
* Offline audio playback
* Gentle animations
* Randomized quotes
* Fully responsive, fullscreen layout

All assets were embedded or base64 encoded to ensure true offline capability.
