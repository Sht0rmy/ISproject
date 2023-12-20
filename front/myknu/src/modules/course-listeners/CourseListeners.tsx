import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import fetcher from "../../utils/fetcher/fetcher";
import List from "../schedule/list/List";
import Modal from "../schedule/modal/Modal";
import modalClasses from "../schedule/student-list/studentList.module.css";
import classes from "../schedule/list/List.module.css";
import { UserRoleType } from "../../types/user-type";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import { mutate } from "swr";

const headerName = `Список студентів на спеціальних курсах`;
const labelHeader = [
  "id",
  "Прізвище Ім'я",
  "Електронна пошта",
  "Група",
  "Спеціальні курси",
];
const inputPlacelolder = "Оберіть спеціальний курс (селектор)";

const CourseListeners = () => {
  const [students, setStudents] = useState<any>([]);
  const { userRole } = useUser();
  const [inputName, setInputName] = useState<string>("");
  const [isModal, setIsModal] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<"create" | "delete">("create");
  const [studentOnEdit, setStudentOnEdit] = useState<any>();

  const [course, setCourse] = useState<any>([]);

  useEffect(() => {
    fetcher<any>(`special-course/list/listeners?q=${inputName}`).then(
      (data: any) => {
        setStudents(data);
      },
    );
  }, [inputName, isModal]);

  return (
    <div>
      {isModal && (
        <CoursesStudentsModal
          student={studentOnEdit}
          setStudents={setStudents}
          setIsModal={setIsModal}
          status={modalStatus}
        />
      )}
      <List
        inputPlacelolder={inputPlacelolder}
        setInputName={setInputName}
        inputName={inputName}
        labelHeader={labelHeader}
        headerName={headerName}
        setIsModal={setIsModal}
        setModalStatus={setModalStatus}
      >
        {students.map((student) => {
          const coursesTitle = student?.specialCourses
            ?.map((course) => course.name)
            .join(", ");

          const coursesValue =
            coursesTitle.length > 15
              ? coursesTitle.slice(0, 15) + "..."
              : coursesTitle;

          return (
            <div className={classes.item}>
              {student.id} | {student.name}| {student.email}|
              {student?.group?.name}|{" "}
              <Tooltip title={coursesTitle}>
                <span>{coursesValue}</span>
              </Tooltip>
              <span className={classes.icons}>
                {userRole === UserRoleType.Admin && (
                  <>
                    <DeleteIcon
                      sx={{ color: "black" }}
                      onClick={() => {
                        setModalStatus("delete");
                        setStudentOnEdit(student);
                        setIsModal(true);
                      }}
                    />
                  </>
                )}
              </span>
            </div>
          );
        })}
      </List>
    </div>
  );
};
type CreateModalProps = {
  status: "create" | "delete";
  id?: string | number;
  setIsModal: any;
  setStudents: any;
  student?: any;
};

const CoursesStudentsModal: React.FC<CreateModalProps> = ({
  status,
  setIsModal,
  setStudents,
  id,
  student,
}) => {
  const [courses, setCourses] = useState<any[]>(student?.specialCourses ?? []);
  const [localStudents, setLocalStudents] = useState<any[]>([]);

  const [localStudent, setLocalStudent] = useState<any>(student);
  const [course, setCourse] = useState<any>();

  const actionName =
    status === "create" ? "Додати студента" : "Видалити студента з курсу";

  useEffect(() => {
    fetcher<any>(`user/list/STUDENT`).then((data) => {
      setLocalStudents(data);
      console.log(data);
    });

    if (status === "create") {
      fetcher<any>(`special-course/list`).then((data) => {
        setCourses(data);
        console.log(data);
      });
    }
  }, []);

  const onCreateHandler = () => {
    if (!course || !localStudent) {
      return;
    }
    const body = {
      studentId: localStudent?.id,
      courseId: course.id,
    };
    fetcher("special-course/add-listener", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((data) => {
        setIsModal(false);
      })
      .catch((eeeee) => {
        console.log(eeeee);
      });
  };

  const onDeleteHandler = () => {
    fetcher<void>(`special-course/remove-listener`, {
      method: "POST",
      body: JSON.stringify({
        studentId: localStudent?.id,
        courseId: course?.id,
      }),
    }).then(() => {
      setIsModal(false);
    });
  };

  const onSelectStudentHandler = (e: any) => {
    let student = localStudents.find((i) => +i.id === +e.target.value);
    setLocalStudent(student);
  };

  const onSelectSpecialCourseHandler = (e: any) => {
    let course = courses.find((i) => +i.id === +e.target.value);
    setCourse(course);
  };

  return (
    <Modal
      actionName={actionName}
      setIsModal={setIsModal}
      onAction={status === "create" ? onCreateHandler : onDeleteHandler}
    >
      <div className={modalClasses.wrapper}>
        <div className={modalClasses.leftSide}>
          <span>Спеціальний курс</span>
        </div>
        <div className={modalClasses.writeSide} defaultValue={course?.id}>
          <select
            className={modalClasses.inputStyle}
            onChange={(e) => onSelectSpecialCourseHandler(e)}
          >
            {courses.map((localCourse: any) => (
              <option style={{ height: "30px" }} value={localCourse?.id}>
                {" "}
                {localCourse?.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={modalClasses.wrapper}>
        <div className={modalClasses.leftSide}>
          <span>Студент</span>
        </div>
        <div className={modalClasses.writeSide} defaultValue={localStudent?.id}>
          <select
            className={modalClasses.inputStyle}
            onChange={(e) => onSelectStudentHandler(e)}
          >
            {status === "delete" ? (
              <option style={{ height: "30px" }} value={localStudent?.id}>
                {localStudent?.name}
              </option>
            ) : (
              localStudents.map((localStudent: any) => (
                <option style={{ height: "30px" }} value={localStudent?.id}>
                  {localStudent?.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default CourseListeners;
