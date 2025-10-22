import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const socials = [
    {
      icon: Facebook,
      link: "https://facebook.com"
    },
    {
      icon: Instagram,
      link: ""
    },
    {
      icon: Youtube,
      link: ""
    },
  ]


  return (
    <footer className="bg-gradient-to-br from-card to-background border-t border-border/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(120,119,198,0.05),transparent_50%)]"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-primary-foreground rounded-xl flex items-center justify-center shadow-lg">
                  <img src="/assets/KalyanLogo.svg" alt="" className='p-0.5 rounded-2xl' />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Kalyan Trust
                </span>
                <span className="text-xs text-muted-foreground -mt-1">Educational Excellence</span>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Empowering education and fostering charitable initiatives to create a brighter future for our community.
            </p>
            <div className="flex space-x-3">
              {socials.map((social, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 rounded-xl border-border/50 hover:border-primary/50 hover:bg-primary/10 flex items-center justify-center"
                    href={social.link}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-lg">Quick Links</h3>
            <div className="space-y-3">
              {['Home', 'About', 'Activities', 'Apply'].map((link, index) => (
                <Link
                  key={index}
                  to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                  className="block text-muted-foreground hover:text-primary transition-all duration-200 text-left hover:translate-x-1"
                >
                  {link}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Our Services */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-lg">Our Services</h3>
            <div className="space-y-3">
              {['GCG Exam', 'Art Championship', 'Educational Workshops', 'Community Programs'].map((service, index) => (
                <motion.div
                  key={service}
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="w-2 h-2 bg-primary/50 rounded-full"></div>
                  <span className="text-muted-foreground">{service}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-lg">Contact Us</h3>
            <div className="space-y-4">
              <motion.div
                className="flex items-center group "
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors mr-3">
                  <Mail className="h-4 w-4 text-primary " />
                </div>
                <span className="text-muted-foreground text-sm">kalyanconsultancy6800@gmail.com</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-3 group"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">+91 99989 06800</span>
              </motion.div>
              <motion.div
                className="flex items-start space-x-3 group"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors mt-0.5">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">
                  Raj kamal Complex, <br />
                  3rd floor, Jakatnaka, Wankaner-363621
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-border/50 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground">
            © {currentYear} Kalyan Educational and Charitable Trust. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-4 sm:mt-0">
            {['Privacy Policy', 'Terms of Service'].map((link) => (
              <motion.button
                key={link}
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ y: -1 }}
              >
                {link}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}