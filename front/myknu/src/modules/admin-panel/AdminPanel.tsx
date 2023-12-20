import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, Backdrop, Fade } from '@mui/material';
import AllUsersCourses from './AllUsersCourses';
import SpecialCourseCreateForm from './SpecialCourseCreateForm';

const AdminPanelContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: 15px;
  background-color: #f0f0f0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const SpecialCoursesButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  border: 1px solid black;
  font-size: 24px;
  color: black;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  width: 80%;
  margin: auto;
  margin-top: 50px;
`;

const CreateSpecialCourseButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
`;

const AdminPanel = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSpecialCoursesManipulation = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCreateSpecialCourse = () => {
        console.log('Створення спеціального курсу');
    };

    return (
        <AdminPanelContainer>
            <h2>Адмін панель</h2>
            <SpecialCoursesButton onClick={handleSpecialCoursesManipulation}>
                Маніпуляція спеціальними курсами
            </SpecialCoursesButton>
            <CreateSpecialCourseButton onClick={handleCreateSpecialCourse}>
                Створити Спеціальний курс
            </CreateSpecialCourseButton>
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                closeAfterTransition
            >
                <ModalContent>
                    <h3>Список користувачів</h3>
                    <AllUsersCourses />
                    <CreateSpecialCourseButton onClick={handleCreateSpecialCourse}>
                        <SpecialCourseCreateForm />
                        Створити Спеціальний курс
                    </CreateSpecialCourseButton>
                </ModalContent>
            </Modal>
        </AdminPanelContainer>
    );
};

export default AdminPanel;
