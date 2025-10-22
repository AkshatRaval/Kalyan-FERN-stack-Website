import { motion } from 'framer-motion'
import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Card, CardContent } from '../ui/Cards';
import { Eye, Mail, MapPin, Phone, Target } from 'lucide-react';
import { milestones, team, values, whatWeDo } from '../constants/About';
import toast, { Toaster } from 'react-hot-toast';


const About = () => {
  document.title = "About | Kalyan Trust"

  const [sending, setSending] = useState(false);
  const form = useRef();

  const serviceId = 'service_h7x526j';
  const templateId = 'template_46ket8i';
  const publicId = 'AVIwzEQbBV_Q4mLkn';

  const sendEmail = (e) => {
    e.preventDefault();

    const formData = form.current;
    const inputs = formData.querySelectorAll('input, textarea');

    let allFieldsNonEmpty = true;

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      // Trim the value to handle cases with only whitespace
      if (input.value.trim() === '') {
        allFieldsNonEmpty = false;
        toast.error(`The field "${input.name || input.id}" is empty.`);
        return
      }
    }

    setSending(true);
    emailjs.sendForm(
      serviceId,
      templateId,
      form.current, {
      publicKey: publicId,
    }).then(
      () => {
        toast.success("Email Sent Successfully!")
        setSending(false)
        form.current.reset()
      },
      (error) => {
        toast.error("Some Error Occured!" + error.text)
        setSending(false)
        form.current.reset()
      },
    );
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                About Kalyan Trust
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Kalyan Education Charitable Trust is a <span className='text-primary font-semibold'>community-drivenorganization</span>  dedicated to empowering students through educational programs and competitions. Expanding its mission, the Trust now fosters <span className='text-primary font-semibold'>entrepreneurship and innovation</span> to cultivate future leaders and contribute to building a <span className='text-primary font-semibold'>developed India (Viksit Bharat).</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="assets/governerPhoto.jpg"
                  alt="Students achievement ceremony"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-lg">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To empower students and communities by providing innovative, affordable, and high-quality educational opportunities that inspire critical thinking, creativity, and personal growth.
                    We are committed to <span className='text-primary font-semibold'>shaping responsible citizens</span> through transparent initiatives in education, entrepreneurship, and social development—creating pathways for success that uplift society and <span className='text-primary font-semibold'>strengthen India's future.</span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-lg">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To build a nation where knowledge, innovation, and opportunity drive progress, making India a truly <span className='text-primary font-semibold'>Viksit Bharat (Developed India).</span>
                    Kalyan envisions becoming a dynamic platform where <span className='text-primary font-semibold'>education meets entrepreneurship</span>, nurturing thinkers, leaders, and change-makers who will redefine the future of our country.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      <section className='py-20 bg-card'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className='px-32 text-center mb-16'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}>
            <h2 className='text-3xl lg:text-5xl font-bold mb-4'>
              Our Core Values
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              These fundamental principles guide everything we do and help us maintain our commitment to excellence.
            </p>
          </motion.div>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className='h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-200'>
                  <CardContent className='text-center p-6'>
                    <div className='bg-primary/10 w-fit p-3 rounded-lg flex itmes-center justify-center mx-auto mt-2 mb-5'>
                      <value.icon className='h-6 w-6 text-primary' />
                    </div>
                    <h3 className='font-bold text-xl'>
                      {value.title}
                    </h3>
                    <p className='text-muted-foreground text-sm mt-1'>
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className='py-20 bg-gradient-to-b from-card to-secondary'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='px-32 text-center mb-16'
          >
            <h2 className='text-3xl lg:text-5xl font-bold mb-4'>
              What We Do
            </h2>
            <p className='max-w-2xl text-lg text-muted-foreground mx-auto'>
              Our comprehensive programs are designed to nurture talent, recognize achievement, and create lasting positive impact.
            </p>
          </motion.div>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 '>
            {
              whatWeDo.map((thing, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2
                  }}
                  viewport={{ once: true }}
                >
                  <Card className='p-1 h-full shadow-2xl '>
                    <CardContent>
                      <div className='my-6 p-2 bg-primary/10 w-fit rounded-2xl mx-auto'>
                        <thing.icon className='h-12 w-12 ' />
                      </div>
                      <h2 className='text-center font-bold text-xl my-3'>
                        {thing.title}
                      </h2>
                      <p className='text-muted-foreground text-sm mb-3 text-justify'>
                        {thing.description}
                      </p>
                      <ul className='list-disc px-5 text-muted-foreground my-5'>
                        {thing.list.map((list, index) => (
                          <li key={index}>{list}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            }
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-t from-card to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From humble beginnings to transforming thousands of lives - explore the key milestones in our journey.
            </p>
          </motion.div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
              >
                <div className="lg:w-1/2">
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-bold">{milestone.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:w-1/2 flex justify-center">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Leadership Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the passionate individuals who lead our mission and drive our vision forward.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover"
                      />
                    </div>
                    <h3 className="font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                Get in Touch
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Have questions about our programs or want to get involved? We'd love to hear from you.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <span>kalyanconsultancy6800@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <span>+91 99989 06800</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>
                    Raj kamal Complex, <br />
                    3rd floor, Jakatnaka, Wankaner-363621
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-background/10 rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold mb-6">Send us a Message</h3>
              <form className="space-y-4" ref={form} onSubmit={sendEmail}>
                <div>
                  <input
                    id='from_name'
                    name='from_name'
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-lg bg-background/20 border border-primary-foreground/20 placeholder-primary-foreground/60 text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
                  />
                </div>
                <div>
                  <input
                    id='from_email'
                    name='from_email'
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-lg bg-background/20 border border-primary-foreground/20 placeholder-primary-foreground/60 text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
                  />
                </div>
                <div>
                  <input
                    id='subject'
                    name='subject'
                    type="text"
                    placeholder="Your Subject"
                    className="w-full px-4 py-3 rounded-lg bg-background/20 border border-primary-foreground/20 placeholder-primary-foreground/60 text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
                  />
                </div>
                <div>
                  <textarea
                    id='message'
                    name='message'
                    placeholder="Your Message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-background/20 border border-primary-foreground/20 placeholder-primary-foreground/60 text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground/50 resize-none"
                  ></textarea>
                </div>
                <button className="w-full font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90 py-2 rounded-xl" type='submit' value="Send">
                  {sending ? "Sending Message..." : "Send Message"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      <Toaster />
    </div>
  )
}

export default About