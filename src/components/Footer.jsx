// Footer.jsx
import { motion } from "framer-motion";
import { FaTwitter, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

const footerVariants = {
  hidden: { opacity: 0, y: 100 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const linkHover = {
  scale: 1.1,
  transition: { type: "spring", stiffness: 300 },
};

export default function Footer() {
  return (
    <>
      <motion.footer
        className="w-full border-t border-white/20 text-white px-6 md:px-12 py-10 flex flex-col gap-8 items-center bg-black"
        variants={footerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Heading */}
        <motion.h2
          className="text-2xl md:text-4xl font-bold tracking-tight text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Let’s Build Something Together.
        </motion.h2>

        {/* Social Links */}
        <motion.div
          className="grid grid-cols-2 sm:flex gap-6 text-lg items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={linkHover}
            className="flex items-center gap-2 hover:text-cyan-400"
          >
            <FaTwitter /> Twitter
          </motion.a>
          <motion.a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={linkHover}
            className="flex items-center gap-2 hover:text-pink-400"
          >
            <FaInstagram /> Instagram
          </motion.a>
          <motion.a
            href="https://github.com/dwaipayandutta"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={linkHover}
            className="flex items-center gap-2 hover:text-gray-300"
          >
            <FaGithub /> GitHub
          </motion.a>
          <motion.a
            href="https://linkedin.com/in/dwaipayandutta"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={linkHover}
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <FaLinkedin /> LinkedIn
          </motion.a>
        </motion.div>

        {/* Tagline or Quote */}
        <motion.p
          className="text-center text-sm text-gray-400 max-w-xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          “Crafting immersive digital experiences through story, code, and interaction.”
        </motion.p>

        {/* Footer Bottom */}
        <motion.p
          className="text-xs text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          © {new Date().getFullYear()} Dwaipayan Dutta. All rights reserved.
        </motion.p>
      </motion.footer>
    </>
  );
}
