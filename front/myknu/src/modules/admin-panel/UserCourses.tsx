import React from 'react';
import useSWR, { mutate } from 'swr';
import fetcher from '../../utils/fetcher/fetcher';
import styled from 'styled-components';

const UserCoursesContainer = styled.div`
    margin-top: 20px;
`;

const CourseItem = styled.li`
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
`;

const DeleteButton = styled.button`
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px;
    cursor: pointer;
    margin-top: 8px;
`;

const UserCourses = ({ userId }: any) => {
    const { data: userCourses } = useSWR<any[]>(`special-courses/courses/${userId}`, fetcher);

    const handleDeleteCourse = async (courseId: number) => {
        try {
            await fetcher(`special-courses/bind/${courseId}`, { method: 'DELETE' });
            mutate(`special-courses/courses/${userId}`);
        } catch (error) {
            console.error('Помилка видалення курсу', error);
        }
    };

    return (
        <UserCoursesContainer>
            <p>Список курсів користувача:</p>
            <ul>
                {userCourses?.map((course) => (
                    <CourseItem key={course.id}>
                        <p>Назва курсу: {course.courses.name}</p>
                        <p>Викладач: {course.courses.instructor}</p>
                        <DeleteButton onClick={() => handleDeleteCourse(course.id)}>
                            Видалити курс
                        </DeleteButton>
                    </CourseItem>
                ))}
            </ul>
        </UserCoursesContainer>
    );
};

export default UserCourses;
