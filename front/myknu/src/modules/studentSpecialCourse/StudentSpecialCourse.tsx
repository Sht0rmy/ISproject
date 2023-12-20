import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import fetcher from "../../utils/fetcher/fetcher";
import { handleBindStudent } from "./StudentSpecialCourse.helpers";
import EmptyPage from "../../components/empty-page/EmptyPage";

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CourseContainer = styled.div`
  font-size: 24px;
  width: 1088px;
  height: 140px;
  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;
  border-radius: 20px;
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #d9d9d9;
  position: relative;
`;

const CourseInfo = styled.div`
  width: 380px;
  margin-right: 150px;
  font-size: 24px;
`;

const EnrollButton = styled.button`
  width: 155px;
  height: 53px;
  background-color: #85fb7a;
  color: black;
  padding: 10px;
  border: 1px solid black;
  border-radius: 20px;
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
`;

const EnrollButtonDisabled = styled.button`
  width: 155px;
  height: 53px;
  background-color: #85fb7a;
  color: black;
  padding: 10px;
  border: 1px solid black;
  border-radius: 20px;
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
  opacity: 0.5;
`;

const StudentSpecialCourse = () => {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user_id");

    if (user) {
      setUserId(user);
    }
  }, []);

  const { data: coursesData } = useSWR<any[]>("special-course/list", fetcher);

  if (coursesData?.length === 0) {
    return <EmptyPage />;
  }

  const isUserSubscribed = (course: any) => {
    return course.listeners.some((listener: any) => listener.id === +userId);
  };

  return (
    <CenteredContainer>
      <div>
        {coursesData?.map((course: any, index: number) => (
          <CourseContainer key={index}>
            <CourseInfo>
              <div>
                <p>Назва курсу: {course.name}</p>
                <p>Викладач: {course.instructor}</p>
              </div>
            </CourseInfo>
            <CourseInfo>
              <div>
                <p>Аудиторія: {course.room}</p>
                <p>Кількість занять: {course.hours}</p>
              </div>
            </CourseInfo>
            {isUserSubscribed(course) ? (
              <EnrollButtonDisabled disabled>Записано</EnrollButtonDisabled>
            ) : (
              <EnrollButton
                onClick={() => handleBindStudent(course.id, +userId)}
              >
                Записатися
              </EnrollButton>
            )}
          </CourseContainer>
        ))}
      </div>
    </CenteredContainer>
  );
};

export default StudentSpecialCourse;
