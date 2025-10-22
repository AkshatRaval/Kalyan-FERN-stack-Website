import React from 'react'
import { motion } from 'framer-motion';
import { ArrowRight, Award, BookOpen, CheckCircle, Heart, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/Cards';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../utils/AuthProvider';

const Home = () => {

  document.title = "Home | Kalyan Trust"
  const navigate = useNavigate()
  const features = [
    {
      icon: BookOpen,
      title: 'Educational Excellence',
      description: 'Comprehensive examination programs designed to enhance learning outcomes'
    },
    {
      icon: Award,
      title: 'Achievement Recognition',
      description: 'Celebrating student accomplishments through various competitions and awards'
    },
    {
      icon: Users,
      title: 'Community Impact',
      description: 'Building stronger communities through educational and charitable initiatives'
    },
    {
      icon: Heart,
      title: 'Charitable Mission',
      description: 'Supporting underprivileged students with scholarships and resources'
    }
  ];

  const stats = [
    { label: 'Students Impacted', value: '1000+' },
    { label: 'Exams Conducted', value: '3' },
    { label: 'Awards Distributed', value: '10+' },
    { label: 'Years of Service', value: '5+' }
  ];



  const activitiesImages = [
    {
      src: "/assets/artChamp-1.jpg",
      title: "Art Championship",
      description: "Creative minds showcasing their artistic talents"
    },
    {
      src: "/assets/planetarium.jpg",
      title: "Education tours",
      description: "Adventures in learning, beyond the classroom."
    },
    {
      src: "/assets/independenceMarch.jpg",
      title: "Social activities",
      description: "Bringing people together for a shared purpose."
    },
  ]


  return (
    <div className='bg-secondary min-h-screen'>
      <section className="relative min-h-screen flex items-center justify-center flex-col">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="mx-auto px-6 py-2 rounded-full w-fit text-sm border border-border/50 bg-background/50 backdrop-blur-sm">
                ✨ Empowering Education Since 2017
              </div>
            </motion.div>

            {/* Main heading */}
            <div className="space-y-6">
              <motion.h1
                className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <span className="block bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                  Welcome to
                </span>
                <span className="block bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent mt-2">
                  Kalyan Trust
                </span>
              </motion.h1>

              {/* Decorative line */}
              <motion.div
                className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 150 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </div>

            {/* Description */}
            <motion.p
              className="max-w-3xl mx-auto text-xl sm:text-2xl text-muted-foreground leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Fostering educational excellence and charitable initiatives to create opportunities
              for every student to <span className="text-primary font-medium">thrive and succeed</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <button
                size="lg"
                className="group h-14 px-8 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center cursor-pointer"
                onClick={() => navigate('/activities')}
              >
                <span className="text-lg font-medium">Explore Activities</span>
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-2xl bg-primary-foreground border-2 hover:bg-accent/50 transition-all duration-300 cursor-pointer  flex items-center justify-center"
                onClick={() => navigate('/about')}>
                <span className="text-lg font-medium">Learn More</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-t from-background to-accent/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="relative p-8 rounded-3xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <motion.h3
                      className="text-4xl lg:text-5xl font-black bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent mb-3"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {stat.value}
                    </motion.h3>
                    <p className="text-muted-foreground font-medium">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gradient-to-b from-background to-card/50 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "4rem" }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="w-16 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full mb-6"
                />
                <h2 className="text-4xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                  About Kalyan Trust
                </h2>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Established with a vision to empower education and serve the community,
                <span className="text-primary font-medium"> Kalyan Educational and Charitable Trust</span> has been
                a beacon of hope for students across the region.
              </p>

              <div className="space-y-6">
                {[
                  'Excellence in educational programs',
                  'Transparent and ethical operations',
                  'Community-focused initiatives'
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-lg font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link
                  size="lg"
                  className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl w-fit transition-all duration-300 flex items-center cursor-pointer text-primary-foreground"
                  to={"/about"}
                >
                  <span className="text-lg font-medium">Read Our Story</span>
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, rotateY: 15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative group">
                {/* Background decoration */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src="/assets/governerPhoto.jpg"
                    alt="Students in classroom"
                    className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                  {/* Overlay content */}
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-sm opacity-90 mb-2">Since 2017</p>
                    <h3 className="text-2xl font-bold">Empowering Students</h3>
                  </div>
                </div>

                {/* Floating stats card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="absolute -bottom-6 -right-6 bg-background/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50"
                >
                  <div className="text-center">
                    <h4 className="text-3xl font-bold text-primary">8+</h4>
                    <p className="text-sm text-muted-foreground">Years of Excellence</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section >

      {/* Features Section */}
      <section className="py-24 relative bg-gradient-to-t from-background to-card/50 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Why Choose Kalyan Trust?
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We are committed to creating meaningful educational experiences and positive community impact
              through innovative programs and unwavering dedication.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-100 bg-background/60 backdrop-blur-sm hover:bg-background/80 overflow-hidden">
                  <CardContent className="p-8 text-center relative">
                    <div className="relative">
                      {/* Icon container */}
                      <motion.div
                        className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 10 }}
                      >
                        <feature.icon className="h-8 w-8 text-primary" />
                      </motion.div>

                      <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-24 bg-gradient-to-b from-background to-card/50 overflow-hidden'>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mx-auto"
          >
            <h2 className="text-4xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Our Activities
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Glimpses from our past events, examinations, and community activities that showcase
              our commitment to educational excellence.
            </p>
          </motion.div>

          <div className='grid md:grid-cols-3 gap-8 mt-16'>
            {
              activitiesImages.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className='group cursor-pointer'
                >
                  <div className='relative overflow-hidden rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-100 bg-background backdrop-blur-sm'>
                    <div className='relative overflow-hidden'>
                      <img src={activity.src} alt={activity.title} className='w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700' />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-white"
                      >
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-foreground transition-colors duration-300">
                          {activity.title}
                        </h3>
                        <p className="text-sm opacity-90 leading-relaxed">
                          {activity.description}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))
            }
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.05),transparent_60%)]"></div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            {/* Main heading */}
            <div className="space-y-6">
              <motion.h2
                className="text-5xl lg:text-7xl font-black leading-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                Ready to Join Our Community?
              </motion.h2>

              <motion.div
                className="w-32 h-1 bg-primary-foreground/50 mx-auto rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: 128 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
              />
            </div>

            <motion.p
              className="text-xl lg:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Take the first step towards educational excellence and community impact.
              Register for our upcoming activities and exams to unlock your potential.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Link
                size="lg"
                variant="secondary"
                className="group h-16 px-10 rounded-2xl bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold flex items-center justify-center"
                to={'/activities'}
              >
                View Activities
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <Link
                size="lg"
                variant="outline"
                className="h-16 px-10 rounded-2xl bg-transparent border-2 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm transition-all duration-300 text-lg font-semibold flex items-center justify-center"
                to={'/signup'}
              >
                Create Account
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex flex-wrap justify-center items-center gap-8 pt-12 opacity-60"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
              transition={{ delay: 1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Trusted by 10,000+ Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span className="text-sm font-medium">15+ Years of Excellence</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">Community Focused</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </div >
  )
}

export default Home