import { motion } from 'framer-motion'
import React, { useState } from 'react';
import { Calendar, Users, Award, Clock, MapPin, FileText, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Cards';
import { useAuth } from '../utils/AuthProvider';
import { activities } from '../constants/Apply';
import { Link, useNavigate } from 'react-router-dom';
import DetailsModal from '../components/DetailsPopup';



const Apply = () => {

  document.title = "Kalyan | Apply Here"

  const { currentUser, userApplicationsData } = useAuth()
  const filters = ['All', 'Exams', 'Competitions', 'Workshops'];
  const [category, setCategory] = useState('all')
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // console.log(userApplicationsData)
  const navigate = useNavigate()
  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <div className="bg-green-100 text-green-800 border-green-200 text-xs px-3 py-0.5 rounded-2xl">Registration Open</div>;
      case 'coming-soon':
        return <div className="bg-gray-100 text-gray-800 border-gray-200 text-xs px-3 py-0.5 rounded-2xl">Coming Soon</div>;
      case 'closed':
        return <div className="bg-red-100 text-red-800 border-red-200 text-xs px-3 py-0.5 rounded-2xl">Registration Closed</div>;
      default:
        return <div variant="outline">{status}</div>;
    }
  };

  const getApplicationStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <div className="bg-gray-100 text-gray-800 border-gray-20 text-xs px-3 py-0.5 rounded-2xl">Under Review</div>;
      case 'approved':
        return <div className="bg-green-100 text-green-800 border-green-200 text-xs px-3 py-0.5 rounded-2xl">Approved</div>;
      case 'rejected':
        return <div className="bg-red-100 text-red-800 border-red-200 text-xs px-3 py-0.5 rounded-2xl">Rejected</div>;
      default:
        return <div variant="outline">{status}</div>;
    }
  };


  const filteredActivities = (category) => {
    if (category === 'all') return activities;
    return activities.filter(activity => activity.category === category && !userApplicationsData[activity.link]);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-40 overflow-hidden">
        {/* Background with geometric patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/20 to-secondary/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(120,119,198,0.1),transparent_50%),radial-gradient(circle_at_30%_80%,rgba(120,119,198,0.08),transparent_50%)]"></div>

        {/* Floating elements */}
        <div className="absolute top-32 left-20 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-60 h-60 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="mx-auto w-fit px-6 py-2 rounded-full text-sm border border-border/50 bg-background/50 backdrop-blur-sm">
                🎯 Programs & Competitions
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
                  Our Activities
                </span>
              </motion.h1>

              {/* Decorative line */}
              <motion.div
                className="w-32 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 128 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </div>

            {/* Description */}
            <motion.p
              className="max-w-4xl mx-auto text-xl sm:text-2xl text-muted-foreground leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Discover our comprehensive range of examinations, competitions, and workshops
              designed to <span className="text-primary font-medium">nurture talent and recognize excellence</span>.
            </motion.p>
          </motion.div>
        </div>

        {/* Animated floating shapes */}
        <motion.div
          animate={{
            y: [0, -25, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-40 right-40 w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-sm"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [360, 180, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-40 left-40 w-24 h-24 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-full blur-sm"
        />
      </section>

      {currentUser && (
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl lg:text-5xl font-bold mb-4">
                  My Applications
                </h2>
                <p className="text-lg text-muted-foreground">
                  Track the status of your submitted applications
                </p>
              </div>

              {userApplicationsData.length > 0 ? (
                <div className="grid gap-6">
                  {userApplicationsData.map((application, index) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="border-none shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">{(application.formType).toUpperCase()}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>Application ID: {application.applicationId}</span>
                                <span>Submitted: {new Date(application.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              {getApplicationStatusBadge(application.status)}
                              <button className='flex items-center border px-3 p-2 hover:bg-secondary/50 rounded-xl cursor-pointer transition-all' onClick={() => navigate(`/application/${application.formType}/${application.id}`)}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Details
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="border-none shadow-lg">
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No Applications Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't submitted any applications. Browse our activities and apply to get started.
                    </p>
                    <button>
                      Browse Activities
                    </button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </section>
      )}

      <section className='min-h-screen py-20'>
        {/* Options */}
        <div className='flex justify-center my-10'>
          <div className='grid grid-cols-2 sm:grid-cols-4 w-fit mx-auto gap-2 sm:gap-5 bg-gray-100 dark:bg-gray-800 p-2 rounded-2xl shadow-md'>
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setCategory(filter.toLowerCase())}
                className={`px-5 py-2 rounded-xl text-sm sm:text-base font-medium transition-colors duration-300 ease-in-out ${category === filter.toLowerCase()
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>



        <div>
          <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
            {filteredActivities(category).map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300 mx-4">
                  <div className="relative">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className='text-xl font-bold'>{activity.title}</span>
                      <div className="capitalize text-sm border px-2 rounded-sm font-bold">
                        {activity.category}
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground">{activity.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{activity.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{activity.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{activity.participants}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{activity.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-muted-foreground">Registration Fee:</span>
                        <div className='flex items-baseline gap-1'>
                          <p className="font-semibold text-lg text-primary">{activity.fee == 0 ? "Free To Apply" : "₹" + activity.fee}</p>
                          <span className='text-xs '>{activity.isTeamBased && "(Per Team)"}</span>
                        </div>
                      </div>

                      <div className="flex space-x-3 items-center text-sm">
                        <button className='border border-border flex items-center px-2 py-1 rounded-sm'
                          type="button"
                          onClick={() => {
                            setSelectedActivity(activity);
                            setIsDetailsModalOpen(true);
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Details
                        </button>
                        {activity.status === 'open' && (
                          <Link className='bg-primary px-2 py-1 border rounded-sm text-primary-foreground' to={`/application/${activity.link}`}>
                            Apply Now
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl lg:text-5xl font-bold">
              Ready to Participate?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of students who have benefited from our programs. Register now and take the first step towards excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!currentUser ? (
                <button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/about')}
                >
                  Create Account
                </button>
              ) : (
                <button className='border border-primary-foreground rounded-lg p-3 px-6 font-semibold'
                
                onClick={() => navigate('/activities')}
                >
                  Browse Activities
                </button>
              )}
              <button
                size="lg"
                variant="outline"
                className="bg-primary-foreground text-primary p-3 px-6 border rounded-lg font-semibold "
                onClick={() => navigate('/about')}
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        activity={selectedActivity}
      />
    </div>
  )
}

export default Apply