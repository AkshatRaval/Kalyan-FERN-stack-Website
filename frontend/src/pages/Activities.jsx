import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Users, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/Dialog';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { galleryImages } from '../constants/Gallery';


export default function Activities() {

  document.title = "Activities | Kalyan Trust"
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/10 border-b border-border/50">
        <div className="absolute inset-0" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >           
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Our Activities
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Capturing moments of educational excellence, creativity, and achievement from our events and activities
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Masonry Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
          >
            <Masonry gutter="20px">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    {/* Image Container with dynamic height */}
                    <div 
                      className="relative overflow-hidden"
                      style={{ height: `${image.height}px` }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="h-full w-full"
                      >
                        <img
                          src={image.url}
                          alt={image.title}
                          className="h-full w-full object-cover"
                        />
                      </motion.div>
                      
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      
                      {/* Hover content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                          {image.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm opacity-90">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{image.date}</span>
                          </div>
                          {image.participants && (
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{image.participants}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Click indicator */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Camera className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl w-full p-0 overflow-hidden">
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {/* Close button */}
                <button
                  variant="ghost"
                  size="sm"
                  className="absolute flex items-center justify-center top-4 right-4 z-20 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Large Image */}
                <div className="relative w-full overflow-hidden" style={{ height: '70vh' }}>
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Image Details */}
                <div className="p-8 bg-background">
                  <DialogTitle className="text-3xl font-bold mb-4">{selectedImage.title}</DialogTitle>
                  <DialogDescription className="text-muted-foreground text-lg mb-6 leading-relaxed">{selectedImage.description}</DialogDescription>
                  
                  <div className="flex flex-wrap gap-6 text-base">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="font-medium">{selectedImage.date}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-medium">{selectedImage.location}</span>
                    </div>
                    {selectedImage.participants && (
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-primary" />
                        <span className="font-medium">{selectedImage.participants} participants</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}