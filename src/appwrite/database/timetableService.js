import { Databases, ID, Query } from 'appwrite';
import client from '../config';

// Initialize the Database service
const databases = new Databases(client);

// Replace with your actual database and collection IDs
const DATABASE_ID = 'YOUR_DATABASE_ID';
const TIMETABLE_COLLECTION_ID = 'YOUR_TIMETABLE_COLLECTION_ID';
const CONFLICT_COLLECTION_ID = 'YOUR_CONFLICT_COLLECTION_ID';

class TimetableService {
    // Create a timetable slot entry
    async createTimetableEntry(entryData) {
        try {
            // Validate for conflicts before creating entry
            const conflicts = await this.checkConflicts(entryData);
            
            if (conflicts.length > 0) {
                // Create conflict records
                for (const conflict of conflicts) {
                    await this.createConflict(conflict);
                }
                return { 
                    success: false, 
                    message: 'Conflicts detected', 
                    conflicts 
                };
            }
            
            // Create timetable entry if no conflicts
            const entry = await databases.createDocument(
                DATABASE_ID,
                TIMETABLE_COLLECTION_ID,
                ID.unique(),
                entryData
            );
            
            return { success: true, entry };
        } catch (error) {
            console.error('Create timetable entry error:', error);
            throw error;
        }
    }

    // Check for conflicts in the timetable
    async checkConflicts(entryData) {
        try {
            const conflicts = [];
            
            // Check for faculty conflict (same faculty, same day, same time)
            const facultyConflicts = await databases.listDocuments(
                DATABASE_ID,
                TIMETABLE_COLLECTION_ID,
                [
                    Query.equal('faculty', entryData.faculty),
                    Query.equal('day', entryData.day),
                    Query.equal('timeSlot', entryData.timeSlot)
                ]
            );
            
            if (facultyConflicts.total > 0) {
                conflicts.push({
                    type: 'faculty',
                    message: `Faculty ${entryData.facultyName} already assigned at ${entryData.day}, ${entryData.timeSlot}`,
                    conflictingEntry: facultyConflicts.documents[0]
                });
            }
            
            // Check for room conflict (same room, same day, same time)
            const roomConflicts = await databases.listDocuments(
                DATABASE_ID,
                TIMETABLE_COLLECTION_ID,
                [
                    Query.equal('room', entryData.room),
                    Query.equal('day', entryData.day),
                    Query.equal('timeSlot', entryData.timeSlot)
                ]
            );
            
            if (roomConflicts.total > 0) {
                conflicts.push({
                    type: 'room',
                    message: `Room ${entryData.room} already booked at ${entryData.day}, ${entryData.timeSlot}`,
                    conflictingEntry: roomConflicts.documents[0]
                });
            }
            
            return conflicts;
        } catch (error) {
            console.error('Check conflicts error:', error);
            throw error;
        }
    }

    // Create a conflict record
    async createConflict(conflictData) {
        try {
            const conflict = await databases.createDocument(
                DATABASE_ID,
                CONFLICT_COLLECTION_ID,
                ID.unique(),
                {
                    ...conflictData,
                    resolved: false,
                    date: new Date().toISOString()
                }
            );
            return { success: true, conflict };
        } catch (error) {
            console.error('Create conflict error:', error);
            throw error;
        }
    }

    // Get all timetable entries
    async getAllTimetableEntries() {
        try {
            const entries = await databases.listDocuments(
                DATABASE_ID,
                TIMETABLE_COLLECTION_ID
            );
            return { success: true, entries: entries.documents };
        } catch (error) {
            console.error('Get timetable entries error:', error);
            throw error;
        }
    }

    // Get timetable by faculty
    async getTimetableByFaculty(facultyId) {
        try {
            const entries = await databases.listDocuments(
                DATABASE_ID,
                TIMETABLE_COLLECTION_ID,
                [Query.equal('faculty', facultyId)]
            );
            return { success: true, entries: entries.documents };
        } catch (error) {
            console.error('Get timetable by faculty error:', error);
            throw error;
        }
    }

    // Get timetable by room
    async getTimetableByRoom(room) {
        try {
            const entries = await databases.listDocuments(
                DATABASE_ID,
                TIMETABLE_COLLECTION_ID,
                [Query.equal('room', room)]
            );
            return { success: true, entries: entries.documents };
        } catch (error) {
            console.error('Get timetable by room error:', error);
            throw error;
        }
    }

    // Get timetable by semester
    async getTimetableBySemester(semester) {
        try {
            const entries = await databases.listDocuments(
                DATABASE_ID,
                TIMETABLE_COLLECTION_ID,
                [Query.equal('semester', semester)]
            );
            return { success: true, entries: entries.documents };
        } catch (error) {
            console.error('Get timetable by semester error:', error);
            throw error;
        }
    }

    // Get all conflicts
    async getAllConflicts() {
        try {
            const conflicts = await databases.listDocuments(
                DATABASE_ID,
                CONFLICT_COLLECTION_ID
            );
            return { success: true, conflicts: conflicts.documents };
        } catch (error) {
            console.error('Get conflicts error:', error);
            throw error;
        }
    }

    // Get unresolved conflicts
    async getUnresolvedConflicts() {
        try {
            const conflicts = await databases.listDocuments(
                DATABASE_ID,
                CONFLICT_COLLECTION_ID,
                [Query.equal('resolved', false)]
            );
            return { success: true, conflicts: conflicts.documents };
        } catch (error) {
            console.error('Get unresolved conflicts error:', error);
            throw error;
        }
    }

    // Resolve conflict
    async resolveConflict(conflictId, resolution) {
        try {
            const conflict = await databases.updateDocument(
                DATABASE_ID,
                CONFLICT_COLLECTION_ID,
                conflictId,
                { 
                    resolved: true,
                    resolution,
                    resolvedAt: new Date().toISOString()
                }
            );
            return { success: true, conflict };
        } catch (error) {
            console.error('Resolve conflict error:', error);
            throw error;
        }
    }

    // Update a timetable entry
    async updateTimetableEntry(entryId, entryData) {
        try {
            const entry = await databases.updateDocument(
                DATABASE_ID,
                TIMETABLE_COLLECTION_ID,
                entryId,
                entryData
            );
            return { success: true, entry };
        } catch (error) {
            console.error('Update timetable entry error:', error);
            throw error;
        }
    }

    // Delete a timetable entry
    async deleteTimetableEntry(entryId) {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                TIMETABLE_COLLECTION_ID,
                entryId
            );
            return { success: true };
        } catch (error) {
            console.error('Delete timetable entry error:', error);
            throw error;
        }
    }
}

const timetableService = new TimetableService();
export default timetableService;