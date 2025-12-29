import {NextRequest, NextResponse} from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Check if request is JSON or FormData
        const contentType = req.headers.get('content-type') || '';
        
        let eventData;
        
        if (contentType.includes('multipart/form-data')) {
            // Handle FormData (with file upload)
            const formData = await req.formData();
            eventData = Object.fromEntries(formData.entries());
            
            const imageField = formData.get('image');
            if (imageField instanceof File) {
                // Upload to Cloudinary
                const arrayBuffer = await imageField.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const uploadResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                        if(error) return reject(error);
                        resolve(results);
                    }).end(buffer);
                });
                eventData.image = (uploadResult as { secure_url: string }).secure_url;
            }
            // If image is already URL, keep it
        } else {
            // Handle JSON
            eventData = await req.json();
        }
        
        // Parse arrays if they're strings
        if (typeof eventData.tags === 'string') {
            eventData.tags = JSON.parse(eventData.tags);
        }
        if (typeof eventData.agenda === 'string') {
            eventData.agenda = JSON.parse(eventData.agenda);
        }
        
        // Generate slug if not provided
        if (!eventData.slug) {
            eventData.slug = eventData.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        }
        
        const createdEvent = await Event.create(eventData);
        
        return NextResponse.json({ 
            message: 'Event created successfully', 
            event: createdEvent 
        }, { status: 201 });
        
    } catch (e) {
        console.error('CREATE EVENT ERROR:', e);
        return NextResponse.json({ 
            message: 'Event Creation Failed', 
            error: e instanceof Error ? e.message : 'Unknown'
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 });
    }
}