import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { setCreatorCourseData } from "../redux/courseSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const getCreatorCourse = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData?.role !== "educator") return; // ✅ stop bad calls

    const creatorCourses = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/course/getcreator`, {
          withCredentials: true,
        });

        dispatch(setCreatorCourseData(result.data));
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Unauthorized");
      }
    };

    creatorCourses();
  }, [userData, dispatch]);
};

export default getCreatorCourse;
