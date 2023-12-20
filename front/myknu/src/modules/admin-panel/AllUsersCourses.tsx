import React, { useState } from 'react';
import useSWR from 'swr';
import fetcher from '../../utils/fetcher/fetcher';
import styled from 'styled-components';
import UserCourses from './UserCourses';

const UsersContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
`;

const UserCard = styled.div`
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    width: 250px;
`;

const ShowCoursesButton = styled.button`
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px;
    cursor: pointer;
`;

const CloseButton = styled.button`
    background-color: #4caf50; 
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px;
    cursor: pointer;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
`;

const AllUsersCourses = () => {
    const { data: users } = useSWR<any[]>('user/all/users', fetcher);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleShowCourses = (userId: any) => {
        setSelectedUserId(userId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <h2>Список користувачів і курсів</h2>
            <UsersContainer>
                {users ? (
                    users.map((user) => (
                        <UserCard key={user.id}>
                            <p>ID: {user.id}</p>
                            <p>Ім'я: {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>Тип: {user.type}</p>
                            <ShowCoursesButton onClick={() => handleShowCourses(user.id)}>
                                Показати курси
                            </ShowCoursesButton>
                            {selectedUserId === user.id && isModalOpen && (
                                <ModalOverlay>
                                    <ModalContent>
                                        <UserCourses userId={user.id} />
                                        <CloseButton onClick={closeModal}>Закрити</CloseButton>
                                    </ModalContent>
                                </ModalOverlay>
                            )}
                        </UserCard>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </UsersContainer>
        </div>
    );
};

export default AllUsersCourses;
