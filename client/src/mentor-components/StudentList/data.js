import axios from 'axios';

// Function to fetch user-specific data from the Flask API
export async function fetchUserData(username) {
    try {
        // Fetch the match data from Flask API
        const response = await axios.get('http://127.0.0.1:5000/match');
        const matchData = response.data;

        // Filter the data to only include the logged-in user's assigned students
        const userData = matchData[username] || [];

        // Format the data for use in the table
        const formattedData = userData.map((student, index) => ({
            id: index + 1,
            userName: student.student,
            progress: Math.round(student.score * 100), // Assuming score is between 0 and 1, convert it to a percentage
        }));

        return formattedData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return [];
    }
}
