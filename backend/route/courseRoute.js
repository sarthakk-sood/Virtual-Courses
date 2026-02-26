import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
 getCourseLecture,
  getCreatorById,
  //getCreatorById,
  getCreatorCourses,
  getPublishedCourses,
  removeCourse,
  removeLecture,
} from "../controller/courseController.js";
import upload from "../middleware/multer.js";

let courseRouter = express.Router();

courseRouter.post("/createcourse", isAuth, createCourse);
courseRouter.get("/getpublishedcourses", getPublishedCourses);
courseRouter.get("/getcreator", isAuth, getCreatorCourses);
courseRouter.post(
  "/editcourse/:courseId",
  isAuth,
  upload.single("thumbnail"),
  editCourse,
);
courseRouter.get("/getcourse/:courseId", isAuth, getCourseById);
courseRouter.delete("/removecourse/:courseId", isAuth, removeCourse);
//for lectures
courseRouter.post("/createlecture/:courseId",isAuth,createLecture)
courseRouter.get("/courselecture/:courseId", isAuth, getCourseLecture);
courseRouter.post("/editlecture/:lectureId", isAuth,upload.single("videoUrl"), editLecture);
courseRouter.delete("/removelecture/:lectureId", isAuth, removeLecture);
courseRouter.post("/creator", isAuth, getCreatorById);
export default courseRouter;
