import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '../../context/ThemeContext'; // Ensure this is the correct path

const courses = [
    {
        id: 1, title: 'React for Beginners', courseType: 'Course', courseImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKaZqUn3wHhRI_qtuLtyi07xMhMYCVoifz9g&s',
        rating: 4.6,
        registered: 24982
    },
    {
        id: 2, title: 'Advanced React', courseType: 'Professional Certificate', courseImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUJIfwlzSyckDVXxiAg62c4yBZBY9vhYJWEw&s',
        rating: 3,
        registered: 10970
    },
    {
        id: 3, title: 'Advanced React', courseType: 'Professional Certificate', courseImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUJIfwlzSyckDVXxiAg62c4yBZBY9vhYJWEw&s',
        rating: 3,
        registered: 10970
    },
    {
        id: 4, title: 'Advanced React', courseType: 'Professional Certificate', courseImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUJIfwlzSyckDVXxiAg62c4yBZBY9vhYJWEw&s',
        rating: 3,
        registered: 10970
    },
    {
        id: 5, title: 'Advanced React', courseType: 'Professional Certificate', courseImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUJIfwlzSyckDVXxiAg62c4yBZBY9vhYJWEw&s',
        rating: 3,
        registered: 10970
    },
];

const MentorCourses = () => {
    const { isDarkMode } = useTheme();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className={`p-10 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div className="mt-6 float-right lg:mt-0">
                <Button onClick={handleOpen}
                    sx={{
                        color: 'white',
                        backgroundColor: '#134B70',
                        paddingY: '10px',
                        paddingX: '10px'
                    }}
                >Add Course</Button>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={open}>
                        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto bg-gray-900 text-white shadow-lg p-4">
                            <Typography id="transition-modal-title" variant="h6" component="h2">
                                Text in a modal
                            </Typography>
                            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                            </Typography>
                        </Box>
                    </Fade>
                </Modal>
            </div>
            <div className="p-6 grid grid-cols-1 gap-y-10 gap-x-5 md:grid-cols-2 lg:grid-cols-3 w-full overflow-y-auto py-10">
                {courses.map((course) => (
                    <Link key={course.id} to={`/mentor/courses/${course.id}`} className={`border rounded-lg shadow hover:shadow-lg transition-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                        <div className='h-full relative p-4 m-3'>
                            <img src={course.courseImage} alt={course.title} className='w-full h-48 mb-4 rounded-lg' />
                            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{course.courseType}</p>
                            <div className='flex items-center gap-2 my-2 font-mono'>
                                <h3 className='font-semibold'>{course.rating}</h3>
                                <Rating name="half-rating-read" defaultValue={course.rating} precision={0.5} readOnly className='opacity-90' />
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>({course.registered})</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MentorCourses;
