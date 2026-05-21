-- 1. First, find your User ID in the Supabase Dashboard (Authentication -> Users)
-- Replace 'YOUR_USER_ID_HERE' with your actual User ID in the variable below.

DO $$
DECLARE
    target_user_id UUID := 'YOUR_USER_ID_HERE'; -- <--- REPLACE THIS
BEGIN
    -- Update the user's role to 'owner' so they can manage properties
    UPDATE public.profiles SET role = 'owner' WHERE id = target_user_id;

    -- Insert Sample Properties
    INSERT INTO public.properties (owner_id, name, type, description, country, city, address, status, main_image_url)
    VALUES 
    (target_user_id, 'Ocean View Villa', 'Villa', 'A beautiful villa with stunning ocean views.', 'Tanzania', 'Zanzibar', 'Nungwi Beach', 'approved', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800'),
    (target_user_id, 'Mountain Retreat Cabin', 'Cabin', 'Cozy cabin nestled in the mountains.', 'Rwanda', 'Musanze', 'Volcanoes National Park', 'approved', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'),
    (target_user_id, 'Modern City Apartment', 'Apartment', 'Sleek apartment in the heart of the city.', 'Kenya', 'Nairobi', 'Westlands', 'approved', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800');

    -- Insert Rooms for the properties
    -- We'll use a subquery to get the property IDs we just inserted
    INSERT INTO public.rooms (property_id, room_number, type, capacity, price_per_night, status)
    SELECT id, '101', 'Deluxe', 2, 150, 'available' FROM public.properties WHERE name = 'Ocean View Villa';
    
    INSERT INTO public.rooms (property_id, room_number, type, capacity, price_per_night, status)
    SELECT id, '201', 'Standard', 4, 120, 'available' FROM public.properties WHERE name = 'Mountain Retreat Cabin';
    
    INSERT INTO public.rooms (property_id, room_number, type, capacity, price_per_night, status)
    SELECT id, '301', 'Studio', 2, 90, 'available' FROM public.properties WHERE name = 'Modern City Apartment';

    RAISE NOTICE 'Seed data inserted successfully!';
END $$;
