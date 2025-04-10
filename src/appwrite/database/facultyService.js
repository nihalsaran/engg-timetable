import { Databases, ID, Query } from 'appwrite';
import client from '../config';

// Initialize the Database service
const databases = new Databases(client);

// Replace with your actual database and collection IDs
const DATABASE_ID = 'YOUR_DATABASE_ID';
const FACULTY_COLLECTION_ID = 'YOUR_FACULTY_COLLECTION_ID';

class FacultyService {
    // Create a new faculty member
    async createFaculty(facultyData) {
        try {
            const faculty = await databases.createDocument(
                DATABASE_ID,
                FACULTY_COLLECTION_ID,
                ID.unique(),
                facultyData
            );
            return { success: true, faculty };
        } catch (error) {
            console.error('Create faculty error:', error);
            throw error;
        }
    }

    // Get all faculty members
    async getAllFaculty() {
        try {
            const faculty = await databases.listDocuments(
                DATABASE_ID,
                FACULTY_COLLECTION_ID
            );
            return { success: true, faculty: faculty.documents };
        } catch (error) {
            console.error('Get faculty error:', error);
            throw error;
        }
    }

    // Get faculty by department
    async getFacultyByDepartment(department) {
        try {
            const faculty = await databases.listDocuments(
                DATABASE_ID,
                FACULTY_COLLECTION_ID,
                [Query.equal('department', department)]
            );
            return { success: true, faculty: faculty.documents };
        } catch (error) {
            console.error('Get faculty by department error:', error);
            throw error;
        }
    }

    // Get faculty by expertise
    async getFacultyByExpertise(expertise) {
        try {
            const faculty = await databases.listDocuments(
                DATABASE_ID,
                FACULTY_COLLECTION_ID,
                [Query.search('expertise', expertise)]
            );
            return { success: true, faculty: faculty.documents };
        } catch (error) {
            console.error('Get faculty by expertise error:', error);
            throw error;
        }
    }

    // Update faculty workload
    async updateFacultyWorkload(facultyId, loadHours) {
        try {
            const faculty = await databases.getDocument(
                DATABASE_ID,
                FACULTY_COLLECTION_ID,
                facultyId
            );

            const updatedFaculty = await databases.updateDocument(
                DATABASE_ID,
                FACULTY_COLLECTION_ID,
                facultyId,
                { loadHours }
            );

            // Update status based on workload percentage
            const loadPercentage = (loadHours / faculty.maxHours) * 100;
            let status = 'available';
            
            if (loadPercentage > 90) {
                status = 'overloaded';
            } else if (loadPercentage > 70) {
                status = 'nearlyFull';
            }
            
            await databases.updateDocument(
                DATABASE_ID,
                FACULTY_COLLECTION_ID,
                facultyId,
                { status }
            );

            return { success: true, faculty: updatedFaculty };
        } catch (error) {
            console.error('Update faculty workload error:', error);
            throw error;
        }
    }

    // Update a faculty member
    async updateFaculty(facultyId, facultyData) {
        try {
            const faculty = await databases.updateDocument(
                DATABASE_ID,
                FACULTY_COLLECTION_ID,
                facultyId,
                facultyData
            );
            return { success: true, faculty };
        } catch (error) {
            console.error('Update faculty error:', error);
            throw error;
        }
    }

    // Delete a faculty member
    async deleteFaculty(facultyId) {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                FACULTY_COLLECTION_ID,
                facultyId
            );
            return { success: true };
        } catch (error) {
            console.error('Delete faculty error:', error);
            throw error;
        }
    }
}

const facultyService = new FacultyService();
export default facultyService;