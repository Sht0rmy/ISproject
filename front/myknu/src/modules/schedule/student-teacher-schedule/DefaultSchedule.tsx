import {FC, useEffect, useState} from 'react';
import {
    AuditoryNumber,
    Day,
    DayBlocksWrapper,
    DaysOfWeek,
    DayTitle,
    Discipline,
    MoreDetailsAboutLeacture,
    ScheduleBlock,
    Teacher,
    Type,
    WholeScheduleWrapper
} from "./DefaultSchedule.styled";
import {SelectTeacherGroup} from "./select-teacher-group/SelectTeacherGroup";
import BasicModal from "../../../components/modal/Modal";
import {lessonTypeToUkranian, mapUkrainianDayToEnglish} from "../../../utils/default-schedule.helpers";
import {useDefaultScheduleContext} from "../../../contexts/DefaultScheduleContext";
import fetcher from "../../../utils/fetcher/fetcher";
import {useUser} from "../../../contexts/UserContext";
import {UserRoleType} from "../../../types/user-type";
import * as React from "react";

const DAYS_OF_WEEK = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П`ятниця'];

const minBlocksPerDay = 4;

const DefaultSchedule: FC = () => {
    const [groupInfoData, setGroupInfoData] = useState<any>();
    const [teacherInfoData, setTeacherInfoData] = useState<any>();
    const {userRole} = useUser();
    const {selectedGroup, selectedTeacher} = useDefaultScheduleContext();

    useEffect(() => {
        if (userRole === UserRoleType.Student) {
            fetcher<any[]>(`group-schedule/list?type=group&id=${selectedGroup}`)
                .then((data: any) => {
                    setGroupInfoData(data);
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            fetcher<any[]>(`group-schedule/list?type=professor&id=${selectedTeacher}`)
                .then((data: any) => {
                    setTeacherInfoData(data);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }, [selectedGroup, selectedTeacher]);

    const teacherInfoOrStudentInfo = userRole === UserRoleType.Student ? groupInfoData : teacherInfoData;

    const maxBlocksPerDay = Math.max(
        ...teacherInfoOrStudentInfo?.map((info: any) => teacherInfoOrStudentInfo.filter((m: any) => m.weekDay === info.weekDay).length) || [0]
    );

    return (
        <WholeScheduleWrapper>
            <SelectTeacherGroup/>
            <DaysOfWeek>
                {DAYS_OF_WEEK.map((day, dayIndex) => {
                    const dayOfWeek = mapUkrainianDayToEnglish(day);
                    const dayInfo = teacherInfoOrStudentInfo?.filter((info: any) => info.weekDay === dayOfWeek) || [];
                    const numberOfBlocks = Math.max(minBlocksPerDay, maxBlocksPerDay);

                    return (
                        <Day key={day}>
                            <DayTitle style={{color: 'white'}}>{day}</DayTitle>
                            <DayBlocksWrapper>
                                {Array.from({length: numberOfBlocks}, (_, blockIndex) => {
                                    const info = dayInfo[blockIndex] || {
                                        disciplineName: '',
                                        professorName: '',
                                        typeLesson: '',
                                        classroom: '',
                                    };

                                    return (
                                        <ScheduleBlock key={blockIndex}>
                                            <Discipline>
                                                Назва дисципліни: <br/>
                                                {info?.discipline?.name}
                                            </Discipline>
                                            <Teacher>
                                                Ім'я викладача: <br/>
                                                {info?.professor?.name}
                                            </Teacher>
                                            <MoreDetailsAboutLeacture>
                                                <AuditoryNumber>
                                                    № Аудиторії: <br/>
                                                    {info?.classroom}
                                                </AuditoryNumber>
                                                <Type>
                                                    Тип: <br/>
                                                    {lessonTypeToUkranian(info.type)}
                                                </Type>
                                            </MoreDetailsAboutLeacture>
                                            <BasicModal
                                                teacherName={info?.professor?.name}
                                                discipline={info?.discipline?.name}
                                                roomNo={info?.classroom}
                                                type={lessonTypeToUkranian(info.type)}
                                                groupName={info?.group?.name}
                                            />
                                        </ScheduleBlock>
                                    );
                                })}
                            </DayBlocksWrapper>
                        </Day>
                    );
                })}
            </DaysOfWeek>
        </WholeScheduleWrapper>
    );
};

export default DefaultSchedule;


