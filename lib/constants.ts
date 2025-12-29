import connectDB from "./mongodb";
import Event from "../database/event.model"; // adjust path if needed

export async function getEvents() {
  await connectDB(); // make sure MongoDB is connected
  const events = await Event.find({}).lean(); // fetch all events
  return events;
}
