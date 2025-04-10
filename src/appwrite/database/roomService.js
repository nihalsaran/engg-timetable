import { Databases, ID, Query } from 'appwrite';
import client from '../config';

// Initialize the Database service
const databases = new Databases(client);

// Replace with your actual database and collection IDs
const DATABASE_ID = 'YOUR_DATABASE_ID';
const ROOM_COLLECTION_ID = 'YOUR_ROOM_COLLECTION_ID';

class RoomService {
    // Create a new room
    async createRoom(roomData) {
        try {
            const room = await databases.createDocument(
                DATABASE_ID,
                ROOM_COLLECTION_ID,
                ID.unique(),
                roomData
            );
            return { success: true, room };
        } catch (error) {
            console.error('Create room error:', error);
            throw error;
        }
    }

    // Get all rooms
    async getAllRooms() {
        try {
            const rooms = await databases.listDocuments(
                DATABASE_ID,
                ROOM_COLLECTION_ID
            );
            return { success: true, rooms: rooms.documents };
        } catch (error) {
            console.error('Get rooms error:', error);
            throw error;
        }
    }

    // Get rooms by department
    async getRoomsByDepartment(department) {
        try {
            const rooms = await databases.listDocuments(
                DATABASE_ID,
                ROOM_COLLECTION_ID,
                [Query.equal('department', department)]
            );
            return { success: true, rooms: rooms.documents };
        } catch (error) {
            console.error('Get rooms by department error:', error);
            throw error;
        }
    }

    // Get rooms by features
    async getRoomsByFeature(feature) {
        try {
            const rooms = await databases.listDocuments(
                DATABASE_ID,
                ROOM_COLLECTION_ID,
                [Query.search('features', feature)]
            );
            return { success: true, rooms: rooms.documents };
        } catch (error) {
            console.error('Get rooms by feature error:', error);
            throw error;
        }
    }

    // Get rooms by minimum capacity
    async getRoomsByCapacity(minCapacity) {
        try {
            const rooms = await databases.listDocuments(
                DATABASE_ID,
                ROOM_COLLECTION_ID,
                [Query.greaterThanEqual('capacity', minCapacity)]
            );
            return { success: true, rooms: rooms.documents };
        } catch (error) {
            console.error('Get rooms by capacity error:', error);
            throw error;
        }
    }

    // Update a room
    async updateRoom(roomId, roomData) {
        try {
            const room = await databases.updateDocument(
                DATABASE_ID,
                ROOM_COLLECTION_ID,
                roomId,
                roomData
            );
            return { success: true, room };
        } catch (error) {
            console.error('Update room error:', error);
            throw error;
        }
    }

    // Delete a room
    async deleteRoom(roomId) {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                ROOM_COLLECTION_ID,
                roomId
            );
            return { success: true };
        } catch (error) {
            console.error('Delete room error:', error);
            throw error;
        }
    }
}

const roomService = new RoomService();
export default roomService;