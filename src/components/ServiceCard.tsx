import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  service: {
    name: string;
    desc: string;
    details: string;
    icon: React.ReactNode;
  };
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer border border-transparent hover:border-indigo-100"
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Background Glow Effect - Replaced with Circle Expansion */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-600 border-[6px] border-slate-800 rounded-full opacity-10 translate-x-1/3 -translate-y-1/3 transition-all duration-700 group-hover:w-full group-hover:h-full group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rounded-none group-hover:opacity-100 group-hover:border-0 z-10" />
      
      <div className="relative z-20">
        {/* Icon */}
        <div className="w-14 h-14 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-6 text-2xl transition-all duration-300 group-hover:bg-white group-hover:text-indigo-600 shadow-lg">
          {service.icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors duration-300 group-hover:text-white">
          {service.name}
        </h3>

        {/* Short Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-4 transition-colors duration-300 group-hover:text-indigo-50">
          {service.desc}
        </p>

        {/* Expandable Details (The Reveal) */}
        <div 
          className={`grid transition-all duration-500 ease-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        >
          <div className="overflow-hidden">
             <div className="pt-4 border-t border-indigo-100/50 group-hover:border-white/20">
                <p className="text-slate-500 text-sm leading-relaxed italic group-hover:text-indigo-100">
                  {service.details}
                </p>
             </div>
          </div>
        </div>

        {/* Learn More CTA */}
        <div className="mt-6 flex items-center group-hover:translate-x-2 transition-transform duration-300">
          <Link 
            to="/quote" 
            className="flex items-center text-indigo-600 font-bold text-sm tracking-wide group-hover:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
