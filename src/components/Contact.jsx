import { useState } from "react";
import { motion } from "framer-motion";
import { FlowButton } from "./ui/FlowButton";

const Contact = () => {
  const [status, setStatus] = useState(""); // 'idle', 'submitting', 'success', 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.target;
    const data = new FormData(form);

    // Replace with your formspree endpoint in .env
    const endpoint =
      import.meta.env.VITE_FORMSPREE_ENDPOINT ||
      "https://formspree.io/f/placeholder";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="py-12 md:py-24 bg-secondary/20 relative w-full border-t border-slate-800"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Let's Connect</h2>
          <p className="text-slate-400 text-lg">
            I'm currently looking for new opportunities. Whether you have a
            question or just want to say hi, I'll try my best to get back to
            you!
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-5 sm:space-y-6 bg-primary/50 backdrop-blur-md p-5 sm:p-8 rounded-2xl border border-slate-800 shadow-xl"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 bg-secondary border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-white transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-secondary border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-white transition-all"
              placeholder="leo@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full px-4 py-3 bg-secondary border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-white transition-all resize-none"
              placeholder="What's on your mind?"
            ></textarea>
          </div>

          <FlowButton
            text={status === "submitting" ? "Sending..." : "Send Message"}
            as="button"
            type="submit"
            disabled={status === "submitting"}
            className="w-full justify-center py-4 disabled:opacity-70 disabled:cursor-not-allowed"
          />

          {status === "success" && (
            <p className="text-emerald-400 text-center mt-4 font-medium">
              Message sent successfully! I'll get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p className="text-red-400 text-center mt-4 font-medium">
              Oops! There was a problem submitting your form. Please try again.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
