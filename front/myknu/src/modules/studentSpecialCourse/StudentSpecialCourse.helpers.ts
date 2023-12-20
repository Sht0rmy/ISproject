import fetcher from "../../utils/fetcher/fetcher";
import { enqueueSnackbar } from "notistack";
import { mutate } from "swr";

export const handleBindStudent = async (
  courseId: number,
  studentId: number,
) => {
  await fetcher(`special-course/add-listener`, {
    method: "POST",
    body: JSON.stringify({
      courseId,
      studentId,
    }),
  })
    .then(() => {
      mutate(`special-course/list`);
      enqueueSnackbar("Вас було успішно записано на курс!", {
        variant: "success",
      });
    })
    .catch((error) => {
      enqueueSnackbar(
        "Щось пішло не так! Можливо ви вже записані на цей курс.",
        { variant: "error" },
      );
      console.error("Failed to bind student to the course", error);
    });
};
