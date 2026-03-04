import React from 'react';
import { motion } from 'motion/react';
import { UserCheck, Clock, Wallet, Heart } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      title: "Qualified Professionals",
      description: "Our team consists of rigorously vetted, background-checked, and expertly trained cleaners who take pride in their work.",
      icon: <UserCheck className="w-6 h-6" />,
      position: "top-left"
    },
    {
      title: "Consistent Reliability",
      description: "We respect your schedule. Count on us to arrive on time and deliver the same high-quality clean, every single visit.",
      icon: <Clock className="w-6 h-6" />,
      position: "top-right"
    },
    {
      title: "Budget Friendly",
      description: "Premium service without the premium price tag. We offer flexible cleaning packages tailored to fit your specific budget.",
      icon: <Wallet className="w-6 h-6" />,
      position: "bottom-left"
    },
    {
      title: "100% Satisfaction",
      description: "Your peace of mind is paramount. If you're not completely happy with our service, we'll return to make it right.",
      icon: <Heart className="w-6 h-6" />,
      position: "bottom-right"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
           <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6 font-display">Why Choose Trydentt?</h2>
           <p className="text-base md:text-lg text-slate-600 mb-4">
             Over 30 years of combined experience: A leadership team with deep industry knowledge.
           </p>
           <p className="text-base md:text-lg text-indigo-600 font-medium">
             A team of qualified professionals providing consistent reliability and fair pricing guaranteed.
           </p>
        </div>

        <div className="relative min-h-0 md:min-h-[600px] flex flex-col md:block items-center justify-center">
            {/* Central Image Container */}
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="relative z-10 w-48 h-48 md:w-96 md:h-96 rounded-full p-2 bg-white shadow-2xl border border-indigo-50 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
            >
                <div className="w-full h-full rounded-full overflow-hidden relative bg-white flex items-center justify-center">
                    <img 
                        src="https://www.countryflags.com/wp-content/uploads/canada-flag-png-large.png" 
                        alt="Canadian Flag - Trydentt Excellence" 
                        className="w-[110%] h-[110%] object-cover"
                        referrerPolicy="no-referrer"
                    />
                    
                    {/* Subtle Badge Overlay */}
                    <div className="absolute inset-0 flex items-end justify-center pb-6 md:pb-12">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-red-100 shadow-sm flex flex-col items-center"
                        >
                            <span className="text-[10px] md:text-xs font-bold text-red-600 uppercase tracking-widest">Proudly Canadian</span>
                            <span className="text-[8px] md:text-[10px] text-slate-500 font-medium">Canadian owned and operated</span>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Orbiting Items - Desktop Only */}
            <div className="absolute inset-0 pointer-events-none md:pointer-events-auto hidden md:block">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, delay: index * 0.1 }}
                        className={`
                            absolute w-80 p-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-indigo-50 shadow-xl hover:scale-105 transition-transform duration-300 cursor-default
                            ${feature.position === 'top-left' ? 'top-[5%] left-[5%] lg:left-[10%]' : ''}
                            ${feature.position === 'top-right' ? 'top-[5%] right-[5%] lg:right-[10%]' : ''}
                            ${feature.position === 'bottom-right' ? 'bottom-[5%] right-[5%] lg:right-[10%]' : ''}
                            ${feature.position === 'bottom-left' ? 'bottom-[5%] left-[5%] lg:left-[10%]' : ''}
                        `}
                    >
                        <div className={`flex items-center gap-4 mb-3 ${feature.position.includes('right') ? 'flex-row-reverse text-right' : ''}`}>
                            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                        </div>
                        <p className={`text-slate-600 text-sm leading-relaxed ${feature.position.includes('right') ? 'text-right' : ''}`}>
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Mobile Stacked View */}
            <div className="md:hidden grid grid-cols-1 gap-4 w-full mt-12">
                 {features.map((feature, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, delay: index * 0.1 }}
                        className="bg-white p-5 rounded-2xl shadow-md border border-indigo-50 flex items-start gap-4"
                    >
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm shrink-0 mt-1">
                            {feature.icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{feature.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    </motion.div>
                 ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
