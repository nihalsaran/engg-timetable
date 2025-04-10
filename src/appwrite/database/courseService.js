import { Databases, ID, Query } from 'appwrite';
import client from '../config';

// Initialize the Database service
const databases = new Databases(client);

// Replace with your actual database and collection IDs
const DATABASE_ID = 'YOUR_DATABASE_ID';
const COURSE_COLLECTION_ID = 'YOUR_COURSE_COLLECTION_ID';

class CourseService {
    // Create a new course
    async createCourse(courseData) {
        try {
            const course = await databases.createDocument(
                DATABASE_ID,
                COURSE_COLLECTION_ID,
                ID.unique(),
                courseData
            );
            return { success: true, course };
        } catch (error) {
            console.error('Create course error:', error);
            throw error;
        }
    }

    // Get all courses
    async getAllCourses() {
        try {
            const courses = await databases.listDocuments(
                DATABASE_ID,
                COURSE_COLLECTION_ID
            );
            return { success: true, courses: courses.documents };
        } catch (error) {
            console.error('Get courses error:', error);
            throw error;
        }
    }

    // Get courses by semester
    async getCoursesBySemester(semester) {
        try {
            const courses = await databases.listDocuments(
                DATABASE_ID,
                COURSE_COLLECTION_ID,
                [Query.equal('semester', semester)]
            );
            return { success: true, courses: courses.documents };
        } catch (error) {
            console.error('Get courses by semester error:', error);
            throw error;
        }
    }

    // Get courses by department
    async getCoursesByDepartment(department) {
        try {
            const courses = await databases.listDocuments(
                DATABASE_ID,
                COURSE_COLLECTION_ID,
                [Query.equal('department', department)]
            );
            return { success: true, courses: courses.documents };
        } catch (error) {
            console.error('Get courses by department error:', error);
            throw error;
        }
    }

    // Update a course
    async updateCourse(courseId, courseData) {
        try {
            const course = await databases.updateDocument(
                DATABASE_ID,
                COURSE_COLLECTION_ID,
                courseId,
                courseData
            );
            return { success: true, course };
        } catch (error) {
            console.error('Update course error:', error);
            throw error;
        }
    }

    // Delete a course
    async deleteCourse(courseId) {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COURSE_COLLECTION_ID,
                courseId
            );
            return { success: true };
        } catch (error) {
            console.error('Delete course error:', error);
            throw error;
        }
    }
}

const courseService = new CourseService();
export default courseService;