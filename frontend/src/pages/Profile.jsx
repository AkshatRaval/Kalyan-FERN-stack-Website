import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Calendar, LogOut, Edit, Award, BookOpen, Trophy,
  Phone, MapPin, School, Heart, Camera, Download, Eye, Clock,
  CheckCircle, XCircle, AlertCircle, MoreHorizontal, Search, Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Cards';
import { Input, Textarea } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { Progress } from '../ui/Progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/DropDown';
import { useAuth } from '../utils/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { doc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function Profile({ setCurrentPage }) {
  const { currentUser, logout, userData, userApplicationsData } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate()

  document.title = "Kalyan | Profile";

  const shortMonthOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  const monthYearOptions = {
    month: 'long',
    year: 'numeric',
  };

  const formatDate = (dateInput, options) => {
    const formatOptions = options || {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    const locale = 'en-GB';

    if (dateInput && typeof dateInput.toDate === 'function') {
      return dateInput.toDate().toLocaleDateString(locale, formatOptions);
    }

    if (dateInput) {
      const date = new Date(dateInput);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString(locale, formatOptions);
      }
    }

    return 'Not specified';
  };



  // Basic profileData (UI defaults) — keep only fields we need
  const profileData = {
    personalInfo: {
      fullName: userData?.displayName,
      email: currentUser?.email,
      phone: userData?.phone,
      dateOfBirth: formatDate(userData?.dateOfBirth || userData?.personalInfo?.dateOfBirth),
      address: userData?.address,
      institution: userData?.schoolName,
      memberSince: formatDate(userData?.timeStamp, monthYearOptions),
    },
    stats: {
      totalApplications: userApplicationsData.length,
      completedActivities: userApplicationsData.filter((app) => app.status != "pending").length,
      achievements: 5,
      successRate: 85
    },
    // applications will be built from real DB below
  };

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm px-3 py-0.5 rounded-xl';
      case 'registered': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm px-3 py-0.5 rounded-xl';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-sm px-3 py-0.5 rounded-xl';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-sm px-3 py-0.5 rounded-xl';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 text-sm px-3 py-0.5 rounded-xl';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/')
  };


  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
              <p className="text-muted-foreground mb-6">
                You need to be logged in to view your profile.
              </p>
              <button onClick={() => navigate('/login')} className="w-full bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 cursor-pointer "> 
                Go to Login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  //
  // === Map real DB applications -> UI-friendly "applications" array ===
  //
  const applications = (userApplicationsData || []).map((app) => {
    const createdAtFormatted = app?.createdAt
      ? formatDate(app.createdAt, shortMonthOptions)
      : 'Not specified';

    // Detect a certificate/download link from documents map (common pattern in your sample)
    const hasCertificate =
      Boolean(app?.documents?.certificate?.downloadLink) ||
      Boolean(app?.certificate) ||
      false;

    return {
      id: app?.applicationId || app?.userId || app?.id || '',
      name: app?.personalInfo?.fullName || app?.formType || 'Application',
      status: (app?.status || 'pending').toLowerCase(),
      date: createdAtFormatted,
      type: app?.formType || '—',
      details: `App ID ${app.applicationId}: ${app.personalInfo?.fullName ?? 'N/A'} (${app.academicInfo?.school ?? 'N/A'}) for the ${app.formType}.`,
      certificate: hasCertificate,
      documents: app?.documents || {},
      raw: app
    };
  });

  // Sort newest first if createdAt exists
  applications.sort((a, b) => {
    const ta = new Date(a.raw?.createdAt || 0).getTime();
    const tb = new Date(b.raw?.createdAt || 0).getTime();
    return tb - ta;
  });

  // Filter + search
  const filteredApplications = applications.filter((app) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = q === '' || (
      (app.name || '').toLowerCase().includes(q) ||
      (app.id || '').toLowerCase().includes(q) ||
      (app.type || '').toLowerCase().includes(q) ||
      (app.details || '').toLowerCase().includes(q)
    );

    const statusFilter = (filterStatus || 'all').toLowerCase();
    const matchesStatus = statusFilter === 'all' || (app.status || '').toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/10 border-b border-border/50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-40" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8"
          >
            {/* Profile Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative group"
            >
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-3xl">
                  {profileData.personalInfo.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-background"></div>
            </motion.div>

            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex-1 text-center lg:text-left"
            >
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2">
                {profileData.personalInfo.fullName}
              </h1>
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-2 lg:space-y-0 lg:space-x-6 text-muted-foreground mb-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{profileData.personalInfo.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {profileData.personalInfo.memberSince}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <School className="h-4 w-4" />
                  <span>{profileData.personalInfo.institution}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-8 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profileData.stats.totalApplications}</div>
                  <div className="text-xs text-muted-foreground">Applications</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profileData.stats.completedActivities}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profileData.stats.achievements}</div>
                  <div className="text-xs text-muted-foreground">Achievements</div>
                </div>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col space-y-3"
            >
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-destructive px-5 py-2 text-destructive-foreground hover:bg-destructive-foreground hover:text-destructive border border-destructive transition-all rounded-2xl cursor-pointer font-semibold"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-primary" />
                      <span>Personal Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.personalInfo.phone || 'Not specified'}</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <span className="text-sm">{profileData.personalInfo.address}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <School className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.personalInfo.institution}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Born on {profileData.personalInfo.dateOfBirth || 'Not specified'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activities (from real DB) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span>Recent Activities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {applications.slice(0, 4).map((app, index) => (
                        <div key={app.raw.id || index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div>
                              <div className="font-medium text-sm">{app.type}</div>
                              <div className="text-xs text-muted-foreground">{app.date}</div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {applications.length === 0 && (
                        <div className="text-center py-6">
                          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">No recent activities</h3>
                          <p className="text-muted-foreground mb-4">You haven't applied for any activities yet.</p>
                          <button onClick={() => setCurrentPage('activities')}>Browse Activities</button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span>All Applications</span>
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search applications..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full lg:w-64"
                        />
                      </div>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-full lg:w-40">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="registered">Registered</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {filteredApplications.map((app) => (
                      <div key={app.raw.id} className="border border-border rounded-lg p-4 hover:bg-accent/30 transition-colors">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold">{app.name}</h4>
                              <div className={getStatusColor(app.status)}>
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </div>
                              {app.certificate && (
                                <div className="flex items-center text-green-600 ml-2">
                                  <Award className="h-3 w-3 mr-1" />
                                  Certificate
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium">Date:</span> {app.date}
                              </div>
                              <div>
                                <span className="font-medium">Type:</span> {app.type}
                              </div>
                              <div>
                                <span className="font-medium">ID:</span> {app.id}
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mt-2">{app.details}</p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button size="sm" variant="outline" onClick={() => navigate(`/application/${app.type}/${app.raw.id}`)}>
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* Example: certificate download if available in documents */}
                            {app.certificate && app.documents && (app.documents.certificate?.downloadLink || app.documents.academicRecords?.downloadLink) && (
                              <a href={app.documents.certificate?.downloadLink || app.documents.academicRecords?.downloadLink} target="_blank" rel="noreferrer">
                                <button size="sm" variant="outline">
                                  <Download className="h-4 w-4" />
                                </button>
                              </a>
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button size="sm" variant="outline">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => navigate(`/application/${app.type}/${app.raw.id}`)}>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                                {app.status === 'registered' && (
                                  <DropdownMenuItem className="text-red-600">Cancel Application</DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredApplications.length === 0 && (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">No applications found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchTerm || filterStatus !== 'all'
                            ? 'Try adjusting your search or filter criteria.'
                            : 'You haven\'t applied for any activities yet.'}
                        </p>
                        <button onClick={() => setCurrentPage('activities')}>
                          Browse Activities
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </section>
    </div>
  );
}
