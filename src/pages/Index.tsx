import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Heart, Search, Plus, Camera, Plane, LogOut, User } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useItineraries } from "@/hooks/useItineraries";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/bg-image.jpg";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("explore");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [newItinerary, setNewItinerary] = useState({
    title: "",
    destination: "",
    type: "adventure" as const,
    duration: "",
    activities: "",
    startDate: "",
    endDate: ""
  });

  const { user, logout } = useAuth();
  const { itineraries, loading, createItinerary, toggleFavorite } = useItineraries();
  const { toast } = useToast();

  const handleCreateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const activities = newItinerary.activities.split(',').map(a => a.trim()).filter(a => a);
      
      await createItinerary({
        title: newItinerary.title,
        destination: newItinerary.destination,
        type: newItinerary.type,
        duration: newItinerary.duration,
        activities,
        startDate: newItinerary.startDate ? new Date(newItinerary.startDate) : undefined,
        endDate: newItinerary.endDate ? new Date(newItinerary.endDate) : undefined,
      });

      setNewItinerary({
        title: "",
        destination: "",
        type: "adventure",
        duration: "",
        activities: "",
        startDate: "",
        endDate: ""
      });

      toast({
        title: "Itinerary created!",
        description: "Your travel itinerary has been saved successfully.",
      });

      setSelectedTab("explore");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create itinerary. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewItinerary(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Use real itineraries if user is logged in, otherwise show mock data
  const mockItineraries = [
    {
      id: "1",
      title: "Tokyo Adventure",
      destination: "Tokyo, Japan",
      type: "adventure" as const,
      duration: "7 days",
      activities: ["Shibuya Crossing", "Mount Fuji", "Temple Visits"],
      userId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false
    },
    {
      id: "2",
      title: "Bali Relaxation",
      destination: "Bali, Indonesia",
      type: "leisure" as const,
      duration: "5 days",
      activities: ["Beach Hopping", "Spa Treatments", "Sunset Dinners"],
      userId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false
    },
    {
      id: "3",
      title: "NYC Business Trip",
      destination: "New York, USA",
      type: "work" as const,
      duration: "3 days",
      activities: ["Conference", "Client Meetings", "Times Square"],
      userId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false
    }
  ];

  const displayItineraries = user ? itineraries : mockItineraries;
  const favoriteItineraries = displayItineraries.filter(it => it.isFavorite);

  const getTripTypeGradient = (type: string) => {
    switch (type) {
      case "adventure":
        return "bg-gradient-adventure";
      case "leisure":
        return "bg-gradient-leisure";
      case "work":
        return "bg-gradient-work";
      default:
        return "bg-gradient-hero";
    }
  };

  const getTripTypeColor = (type: string) => {
    switch (type) {
      case "adventure":
        return "bg-destructive text-destructive-foreground";
      case "leisure":
        return "bg-primary text-primary-foreground";
      case "work":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Travel Planner</h2>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.displayName || user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)}>
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Travel destinations collage"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Plan Your Perfect
            <span className="block bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent">
              Journey
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Create detailed travel itineraries, discover amazing destinations, and make memories that last forever
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-primary-light hover:text-primary transition-smooth shadow-hover"
              onClick={() => user ? setSelectedTab("create") : setShowAuthModal(true)}
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Itinerary
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary transition-smooth"
              onClick={() => setSelectedTab("explore")}
            >
              <Search className="mr-2 h-5 w-5" />
              Explore Trips
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="explore" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Explore
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favorites
              </TabsTrigger>
            </TabsList>

            <TabsContent value="explore" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search destinations or activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Filter by Location
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading your itineraries...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayItineraries.map((itinerary) => (
                    <Card key={itinerary.id} className="shadow-card hover:shadow-hover transition-smooth border-0 bg-gradient-card">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className={getTripTypeColor(itinerary.type)}>
                            {itinerary.type}
                          </Badge>
                          {user && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => toggleFavorite(itinerary.id, itinerary.isFavorite || false)}
                            >
                              <Heart className={`h-4 w-4 ${itinerary.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                          )}
                        </div>
                        <CardTitle className="text-xl">{itinerary.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {itinerary.destination}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {itinerary.duration}
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Activities:</p>
                          <div className="flex flex-wrap gap-1">
                            {itinerary.activities.map((activity, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button className="w-full mt-4" variant="outline">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {!user && (
                <div className="text-center py-8 bg-muted/30 rounded-lg mt-6">
                  <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sign in to save your itineraries</h3>
                  <p className="text-muted-foreground mb-4">Create an account to save and manage your travel plans</p>
                  <Button onClick={() => setShowAuthModal(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              {user ? (
                <Card className="shadow-card border-0 bg-gradient-card">
                  <CardHeader className="text-center">
                    <Plane className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <CardTitle className="text-2xl">Create New Itinerary</CardTitle>
                    <CardDescription>
                      Start planning your next adventure with our easy-to-use planner
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateItinerary} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Trip Title</label>
                          <Input 
                            name="title"
                            value={newItinerary.title}
                            onChange={handleInputChange}
                            placeholder="My Amazing Trip" 
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Destination</label>
                          <Input 
                            name="destination"
                            value={newItinerary.destination}
                            onChange={handleInputChange}
                            placeholder="Paris, France" 
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Trip Type</label>
                          <select 
                            name="type"
                            value={newItinerary.type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                            required
                          >
                            <option value="adventure">Adventure</option>
                            <option value="leisure">Leisure</option>
                            <option value="work">Work</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Start Date</label>
                          <Input 
                            name="startDate"
                            value={newItinerary.startDate}
                            onChange={handleInputChange}
                            type="date" 
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">End Date</label>
                          <Input 
                            name="endDate"
                            value={newItinerary.endDate}
                            onChange={handleInputChange}
                            type="date" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Duration</label>
                        <Input 
                          name="duration"
                          value={newItinerary.duration}
                          onChange={handleInputChange}
                          placeholder="e.g., 7 days" 
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Activities</label>
                        <Input 
                          name="activities"
                          value={newItinerary.activities}
                          onChange={handleInputChange}
                          placeholder="Add activities separated by commas" 
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-hero text-white border-0 shadow-hover">
                        <Camera className="mr-2 h-4 w-4" />
                        Create Itinerary
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12">
                  <Plane className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Sign in to create itineraries</h3>
                  <p className="text-muted-foreground mb-6">
                    Create an account to start planning and saving your travel itineraries
                  </p>
                  <Button onClick={() => setShowAuthModal(true)} className="bg-gradient-hero text-white border-0">
                    <User className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              {!user ? (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Sign in to save favorites</h3>
                  <p className="text-muted-foreground mb-6">
                    Create an account to save your favorite itineraries for quick access
                  </p>
                  <Button onClick={() => setShowAuthModal(true)} className="bg-gradient-hero text-white border-0">
                    <User className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </div>
              ) : favoriteItineraries.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start exploring itineraries and save your favorites here
                  </p>
                  <Button 
                    onClick={() => setSelectedTab("explore")}
                    className="bg-gradient-hero text-white border-0"
                  >
                    Explore Itineraries
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteItineraries.map((itinerary) => (
                    <Card key={itinerary.id} className="shadow-card hover:shadow-hover transition-smooth border-0 bg-gradient-card">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className={getTripTypeColor(itinerary.type)}>
                            {itinerary.type}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => toggleFavorite(itinerary.id, true)}
                          >
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                        <CardTitle className="text-xl">{itinerary.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {itinerary.destination}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {itinerary.duration}
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Activities:</p>
                          <div className="flex flex-wrap gap-1">
                            {itinerary.activities.map((activity, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button className="w-full mt-4" variant="outline">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <section className="py-16 bg-gradient-card">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Join thousands of travelers who plan their perfect trips with our platform
          </p>
          {!user && (
            <Button 
              size="lg" 
              onClick={() => setShowAuthModal(true)}
              className="bg-white text-primary hover:bg-primary-light hover:text-primary transition-smooth shadow-hover"
            >
              <User className="mr-2 h-5 w-5" />
              Get Started Today
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;