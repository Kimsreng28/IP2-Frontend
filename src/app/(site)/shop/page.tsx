"use client";
import { motion } from "framer-motion";
export default function Technical() {
  return (
    <>
      <section className="flex flex-col items-center py-20">
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              x: 20,
            },

            visible: {
              opacity: 1,
              x: 0,
            },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
          className="w-3/5 max-w-c-1390  px-4 max-[1000px]:w-full"
        >
        </motion.div>
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              x: -20,
            },

            visible: {
              opacity: 1,
              x: 0,
            },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <h1 className="flex text-3xl justify-center items-center text-center h-screen">Shop</h1>
        </motion.div>
      </section>

    </>
  );
}
