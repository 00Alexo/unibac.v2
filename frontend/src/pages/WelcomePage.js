import { motion, useInView, useScroll } from "framer-motion";
import { useRef } from "react";
import VantaGlobe from "../components/VantaGlobe";
import WelcomeHome from "../components/WelcomeHome";

const WelcomePage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const AnimatedTitle = ({ children }) => (
    <motion.h2
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6 }}
      className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
    >
      {children}
    </motion.h2>
  );

  const FeatureCard = ({ icon, title, text, index }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay: index * 0.2, duration: 0.5 }}
      className="p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </motion.div>
  );

  const ListItem = ({ number, title, text }) => (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      className="flex gap-6 items-start mb-12"
    >
      <div className="text-4xl font-bold text-blue-600">{number}.</div>
      <div>
        <h4 className="text-2xl font-bold mb-2">{title}</h4>
        <p className="text-gray-600">{text}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen" ref={containerRef}>
      <VantaGlobe />
      <WelcomeHome />

      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
      />

      <div className="bg-white/95 backdrop-blur-xl pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4">
          <section className="mb-32">
            <AnimatedTitle>Misiunea Noastră</AnimatedTitle>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="text-2xl text-center max-w-4xl mx-auto leading-relaxed text-gray-700"
            >
              Să transformăm educația prin tehnologie, oferind fiecărui elev 
              instrumentele necesare pentru succesul academic și personal.
            </motion.div>
          </section>

          <section className="mb-32">
            <AnimatedTitle>Valorile Noastre</AnimatedTitle>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon="🚀"
                title="Inovație"
                text="Implementăm soluții tehnologice de ultimă oră"
                index={0}
              />
              <FeatureCard
                icon="🤝"
                title="Colaborare"
                text="Promovăm învățarea colaborativă în comunitate"
                index={1}
              />
              <FeatureCard
                icon="🎯"
                title="Precizie"
                text="Conținut academic verificat și actualizat"
                index={2}
              />
            </div>
          </section>

          <section className="mb-32">
            <AnimatedTitle>Cum Funcționăm</AnimatedTitle>
            <div className="max-w-4xl mx-auto">
              <ListItem
                number={1}
                title="Alege Subiectul"
                text="Selectează din mii de subiecte și materiale educaționale"
              />
              <ListItem
                number={2}
                title="Interacționează"
                text="Rezolvă exerciții și primește feedback instant"
              />
              <ListItem
                number={3}
                title="Progresează"
                text="Urmărește evoluția și compară-te cu alți utilizatori"
              />
            </div>
          </section>

          <section>
            <AnimatedTitle>Impactul Nostru</AnimatedTitle>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { value: "NULL", label: "Utilizatori" },
                { value: "NULL", label: "Rata de succes" },
                { value: "NULL", label: "Subiecte rezolvate" },
                { value: "24/7", label: "Disponibilitate" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-blue-50 rounded-xl"
                >
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {item.value}
                  </div>
                  <div className="text-gray-600">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;