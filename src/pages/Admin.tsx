import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Upload, Plus, Edit, Trash2, Shield, Users, MapPin } from "lucide-react";
import { Navigate } from "react-router-dom";

const Admin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    description: "",
    sport: "",
    price_per_hour: "",
    image: null as File | null,
    amenities: [] as string[],
    operating_hours: {
      monday: { open: "09:00", close: "21:00" },
      tuesday: { open: "09:00", close: "21:00" },
      wednesday: { open: "09:00", close: "21:00" },
      thursday: { open: "09:00", close: "21:00" },
      friday: { open: "09:00", close: "21:00" },
      saturday: { open: "08:00", close: "22:00" },
      sunday: { open: "08:00", close: "22:00" }
    },
    contact_info: {
      phone: "",
      email: ""
    }
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const sports = ["badminton", "football", "tennis", "basketball", "cricket", "squash", "table_tennis"] as const;
  const amenityOptions = ["Parking", "Changing Rooms", "Equipment Rental", "Cafeteria", "Air Conditioning", "Lighting", "Washrooms"];

  useEffect(() => {
    checkAdminAccess();
    loadFacilities();
    loadUsers();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin access:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const loadFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading facilities:', error);
        toast.error('Failed to load facilities');
      } else {
        setFacilities(data || []);
      }
    } catch (error) {
      console.error('Error loading facilities:', error);
      toast.error('Failed to load facilities');
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (role)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading users:', error);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('facility-images')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('facility-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;
      if (formData.image) {
        imageUrl = await handleImageUpload(formData.image);
        if (!imageUrl) {
          setLoading(false);
          return;
        }
      }

      const facilityData = {
        name: formData.name,
        location: formData.location,
        address: formData.address,
        description: formData.description,
        sport: formData.sport as "badminton" | "tennis" | "football" | "cricket" | "basketball" | "squash" | "table_tennis",
        price_per_hour: parseInt(formData.price_per_hour),
        image_url: imageUrl,
        amenities: formData.amenities,
        operating_hours: formData.operating_hours as any,
        contact_info: formData.contact_info as any,
        is_active: true
      };

      if (editingId) {
        const { error } = await supabase
          .from('facilities')
          .update(facilityData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Facility updated successfully');
      } else {
        const { error } = await supabase
          .from('facilities')
          .insert(facilityData);

        if (error) throw error;
        toast.success('Facility created successfully');
      }

      // Reset form
      setFormData({
        name: "",
        location: "",
        address: "",
        description: "",
        sport: "",
        price_per_hour: "",
        image: null,
        amenities: [],
        operating_hours: {
          monday: { open: "09:00", close: "21:00" },
          tuesday: { open: "09:00", close: "21:00" },
          wednesday: { open: "09:00", close: "21:00" },
          thursday: { open: "09:00", close: "21:00" },
          friday: { open: "09:00", close: "21:00" },
          saturday: { open: "08:00", close: "22:00" },
          sunday: { open: "08:00", close: "22:00" }
        },
        contact_info: { phone: "", email: "" }
      });
      setEditingId(null);
      await loadFacilities();
    } catch (error) {
      console.error('Error saving facility:', error);
      toast.error('Failed to save facility');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (facility: any) => {
    setFormData({
      name: facility.name,
      location: facility.location,
      address: facility.address,
      description: facility.description || "",
      sport: facility.sport,
      price_per_hour: facility.price_per_hour.toString(),
      image: null,
      amenities: facility.amenities || [],
      operating_hours: facility.operating_hours || {
        monday: { open: "09:00", close: "21:00" },
        tuesday: { open: "09:00", close: "21:00" },
        wednesday: { open: "09:00", close: "21:00" },
        thursday: { open: "09:00", close: "21:00" },
        friday: { open: "09:00", close: "21:00" },
        saturday: { open: "08:00", close: "22:00" },
        sunday: { open: "08:00", close: "22:00" }
      },
      contact_info: facility.contact_info || { phone: "", email: "" }
    });
    setEditingId(facility.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this facility?')) return;

    try {
      const { error } = await supabase
        .from('facilities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Facility deleted successfully');
      await loadFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
      toast.error('Failed to delete facility');
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>

        <Tabs defaultValue="facilities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="facilities" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Facilities</span>
            </TabsTrigger>
            <TabsTrigger value="add-facility" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Facility</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="facilities">
            <Card>
              <CardHeader>
                <CardTitle>Manage Facilities</CardTitle>
                <CardDescription>View and manage all sports facilities</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Sport</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price/Hour</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facilities.map((facility: any) => (
                      <TableRow key={facility.id}>
                        <TableCell className="font-medium">{facility.name}</TableCell>
                        <TableCell className="capitalize">{facility.sport}</TableCell>
                        <TableCell>{facility.location}</TableCell>
                        <TableCell>₹{facility.price_per_hour}</TableCell>
                        <TableCell>
                          <Badge variant={facility.is_active ? "default" : "secondary"}>
                            {facility.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(facility)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(facility.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-facility">
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Facility' : 'Add New Facility'}</CardTitle>
                <CardDescription>
                  {editingId ? 'Update facility information' : 'Create a new sports facility'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Facility Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sport">Sport Type</Label>
                      <Select
                        value={formData.sport}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, sport: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sport" />
                        </SelectTrigger>
                        <SelectContent>
                          {sports.map((sport) => (
                            <SelectItem key={sport} value={sport} className="capitalize">
                              {sport}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price per Hour (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price_per_hour}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_per_hour: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {amenityOptions.map((amenity) => (
                        <div
                          key={amenity}
                          className={`p-2 rounded-md border cursor-pointer transition-colors ${
                            formData.amenities.includes(amenity)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background hover:bg-accent'
                          }`}
                          onClick={() => toggleAmenity(amenity)}
                        >
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Facility Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        image: e.target.files?.[0] || null 
                      }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Phone</Label>
                      <Input
                        id="phone"
                        value={formData.contact_info.phone}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          contact_info: { ...prev.contact_info, phone: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Contact Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.contact_info.email}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          contact_info: { ...prev.contact_info, email: e.target.value }
                        }))}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button type="submit" disabled={loading} className="bg-gradient-energy shadow-energy">
                      {loading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent" />
                      ) : (
                        <>
                          {editingId ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                          {editingId ? 'Update Facility' : 'Add Facility'}
                        </>
                      )}
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({
                            name: "",
                            location: "",
                            address: "",
                            description: "",
                            sport: "",
                            price_per_hour: "",
                            image: null,
                            amenities: [],
                            operating_hours: {
                              monday: { open: "09:00", close: "21:00" },
                              tuesday: { open: "09:00", close: "21:00" },
                              wednesday: { open: "09:00", close: "21:00" },
                              thursday: { open: "09:00", close: "21:00" },
                              friday: { open: "09:00", close: "21:00" },
                              saturday: { open: "08:00", close: "22:00" },
                              sunday: { open: "08:00", close: "22:00" }
                            },
                            contact_info: { phone: "", email: "" }
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Skill Level</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.display_name}</TableCell>
                        <TableCell>{user.location || 'Not specified'}</TableCell>
                        <TableCell className="capitalize">{user.skill_level || 'beginner'}</TableCell>
                        <TableCell>
                          <Badge variant={user.user_roles?.[0]?.role === 'admin' ? "default" : "secondary"}>
                            {user.user_roles?.[0]?.role || 'user'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;