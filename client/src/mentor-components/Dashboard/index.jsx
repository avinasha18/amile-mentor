import React, { useEffect, useState } from 'react';
import { Bar, Radar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, ArcElement, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';
import Cookies from 'js-cookie';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FaUserCircle, FaDollarSign, FaBookOpen, FaStar, FaTasks } from 'react-icons/fa';
import DashboardBox from './DashboardBox'; // Ensure this is the correct path
import { FaChalkboardTeacher } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import UserDetailModal from '../StudentList/UserDetailModal';
import { Actions } from '../../hooks/actions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    coursesCreated: 0,
    skillRatingLabels: [],
    skillRatingValues: [],
    studentsProgress: [],
    earnings: 0,
    students: [],
    studentsPlaced: 0,
  });
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [studentsData, setStudentsData] = useState([])
  const userId = Cookies.get('mentorId');
  const userType = 'mentor';

  const handleStartChat = (user) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const currentUserId = Cookies.get("mentorId"); // Get mentor ID from cookies or authentication
        const response = await Actions.fetchMentor(currentUserId);
        const data = response.data.data;

        const responseStudent = await Actions.getStudent();
        const responseAvgProgress = await Actions.getAvgProgress();

        if (responseStudent.data.success && responseAvgProgress.data.success) {
          const mappedData = responseStudent.data.studentUsernames.map((username, index) => {
            const studentProgress = responseAvgProgress.data.studentData.find(
              (student) => student.username === username.username
            );
            return {
              index: index + 1,
              id: username._id,
              userName: username.username,
              progress: studentProgress ? Math.round(studentProgress.avgProgress) : 0,
              skills: username.skills || [],
            };
          });
          setStudentsData(mappedData);

          // Collect all skills across students and normalize case
          const allSkills = {};
          mappedData.forEach((student) => {
            student.skills.forEach((skill) => {
              const normalizedSkill = skill.toLowerCase(); // Normalize skill to lowercase
              if (allSkills[normalizedSkill]) {
                allSkills[normalizedSkill] += 1; // Count occurrences of each skill
              } else {
                allSkills[normalizedSkill] = 1;
              }
            });
          });

          // Convert skill data to radar chart format
          const skillLabels = Object.keys(allSkills);
          const skillValues = Object.values(allSkills);

          console.log(skillLabels);
          console.log(skillValues);

          setStatistics({
            totalStudents: data.students.length,
            coursesCreated: 0,
            skillRatingLabels: skillLabels, // Use the skill values here
            skillRatingValues: skillValues,
            studentsProgress: [],
            earnings: 0,
            students: mappedData,
            studentsPlaced: 0,
          });
        } else {
          console.log("Failed to fetch student or progress data");
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };
    fetchStatistics();
  }, []);


  if (!statistics) {
    return <div>Loading...</div>;
  }

  const skillData = {
    labels: statistics.skillRatingLabels.length > 0 ? statistics.skillRatingLabels : [], // Labels are unique skills
    datasets: [
      {
        label: 'Number of Students with Skill',
        data: statistics.skillRatingValues.length > 0 ? statistics.skillRatingValues : [], // Data is the number of students with each skill
        backgroundColor: 'rgba(34, 202, 236, 0.2)',
        borderColor: 'rgba(34, 202, 236, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(34, 202, 236, 1)',
        pointBorderColor: '#fff',
      },
    ],
  };


  // Compute the largest value in skillRatingValues
  const largestSkillValue = Math.max(...statistics.skillRatingValues);

  // Update the skillOptions to dynamically adjust the scales based on the largest skill value
  const skillOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        suggestedMin: 0, // Keep it at 0 to show full range from 0
        suggestedMax: largestSkillValue , // Add a buffer of 10 to the largest value
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };


  const progressData = {
    labels: statistics.students.map((student) => student.userName), // Array of student usernames
    datasets: [
      {
        label: 'Student Progress',
        data: statistics.students.map((student) => student.progress), // Array of each student's progress
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF8000', '#66B2FF', '#FF9900'], // Colors for the bars
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF8000', '#66B2FF', '#FF9900'], // Border colors for the bars
        borderWidth: 2,
      },
    ],
  };


  const progressOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Overall Students Progress',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  const revenueData = {
    labels: ['Total Revenue', 'Available', 'Withdrawn'],
    datasets: [
      {
        data: [statistics.earnings.total, statistics.earnings.available, statistics.earnings.withdrawn],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 0,
      },
    ],
  };

  const revenueOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const studentsPlacedData = {
    labels: ['Students not Placed', 'Students Placed'],
    datasets: [
      {
        data: [statistics.totalStudents, statistics.studentsPlaced],
        backgroundColor: ['#FF6384', '#36A2EB'],
        borderWidth: 0,
      },
    ],
  };

  const studentsPlacedOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <>
      <div className={`right-content overflow-y-auto no-scrollbar w-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} p-6`}>
        {/* Dashboard Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-6">
          <DashboardBox color={["#FF6384", "#FF80A1"]} icon={<FaUserCircle />} title={'Total Students'} value={statistics.totalStudents} />
          <DashboardBox color={["#36A2EB", "#5AA0FF"]} icon={<FaBookOpen />} title={'Courses Taught'} value={statistics.coursesCreated} />
          <DashboardBox color={["#FFCE56", "#FFDF7B"]} icon={<FaStar />} title={'Avg Feedback'} value={statistics.avgFeedback} />
          <DashboardBox color={["#FF8000", "#FF9900"]} icon={<FaTasks />} title={'Completed Sessions'} value={statistics.completedSessions} />
        </div>

        {/* Charts and Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-5">
          {/* Left Column - Charts */}
          <div className="space-y-6">
            {/* Progress Bar Chart */}
            <div className={`p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-4 text-center">Students Progress</h2>
              <div className="relative h-64">
                <Bar data={progressData} options={progressOptions} />
              </div>
            </div>

            {/* Skill Rating Radar Chart */}
            <div className={`p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-4 text-center">Skill Rating</h2>
              <div className="relative h-64">
                <Radar data={skillData} options={skillOptions} />
              </div>
            </div>
          </div>

          {/* Right Column - Table and Revenue Charts */}
          <div className="flex flex-col space-y-6">
            {/* Students Table */}
            <div className={`p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-4">Students Overview</h2>
              <TableContainer component={Paper} className={`border h-[250px] ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                <Table>
                  <TableHead>
                    <TableRow className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <TableCell className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Name</TableCell>
                      <TableCell className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Progress</TableCell>
                      <TableCell className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {statistics.students.map((student) => (
                      <TableRow key={student.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <TableCell>{student.userName}</TableCell>
                        <TableCell>{student.progress} %</TableCell>
                        <TableCell>
                          <button onClick={() => handleStartChat(student)}>Message</button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* Revenue Pie Charts */}
            <div className="flex space-x-6">
              <div className={`flex-1 p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className="text-xl font-semibold mb-4 text-center">Revenue Overview</h2>
                <div className="relative h-32">
                  <Doughnut data={revenueData} options={revenueOptions} />
                </div>
              </div>
              <div className={`flex-1 p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className="text-xl font-semibold mb-4 text-center">Students Placed</h2>
                <div className="relative h-32">
                  <Doughnut data={studentsPlacedData} options={studentsPlacedOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
};

export default Dashboard;
