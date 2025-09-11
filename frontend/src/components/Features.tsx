import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Globe, Shield, Code } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Deploy your applications with zero configuration and get instant global CDN distribution.'
    },
    {
      icon: Globe,
      title: 'Global Edge',
      description: 'Serve your content from 100+ edge locations worldwide for optimal performance.'
    },
    {
      icon: Shield,
      title: 'Secure by Default',
      description: 'Built-in security features including HTTPS, DDoS protection, and secure headers.'
    },
    {
      icon: Code,
      title: 'Developer Experience',
      description: 'Seamless integration with your favorite tools and frameworks you already love.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            Everything you need to ship
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From development to production, Vercel provides the tools and infrastructure 
            to build and deploy your applications with confidence.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-lg p-6 h-full border border-gray-200 hover:shadow-lg transition-all duration-300 group-hover:border-gray-300">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
