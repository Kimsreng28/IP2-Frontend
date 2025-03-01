"use client";
import { motion } from "framer-motion";

type HeaderInfo = {
  subtitle: string;
};

const SectionHeader = ({ headerInfo }: { headerInfo: HeaderInfo }) => {
  const { subtitle } = headerInfo;

  return (
    <>
      {/* <!-- Section Title Start --> */}
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            y: -20,
          },

          visible: {
            opacity: 1,
            y: 0,
          },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 1, delay: 0.1 }}
        viewport={{ once: true }}
        className="animate_top mx-auto text-center"
      >
        <h2 className="mx-auto mb-4 text-3xl font-bold text-black dark:text-white max-[700px]:text-xl md:w-4/5 xl:w-1/2 xl:text-sectiontitle3">
          {subtitle}
        </h2>
        <div className="flex h-1 w-full justify-center ">
          <div className="h-1 w-[150px] rounded-full bg-green-400"></div>
        </div>
      </motion.div>
      {/* <!-- Section Title End --> */}
    </>
  );
};

export default SectionHeader;
