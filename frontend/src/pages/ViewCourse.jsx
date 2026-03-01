import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setSelectedCourse } from "../redux/courseSlice";
import { useEffect } from "react";
import img from "../assets/empty.jpg";
import { FaLock, FaPlayCircle, FaStar } from "react-icons/fa";
import { useState } from "react";
import { serverUrl } from "../App";
import Card from "../components/Card.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function ViewCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const { selectedCourse } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [creatorCourses, setCreatorCourses] = useState(null);
  const { userData } = useSelector((state) => state.user);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchCourseData = async () => {
    courseData.map((course) => {
      if (course._id === courseId) {
        dispatch(setSelectedCourse(course));
        return null;
      }
    });
  };
  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) {
      const creatorCourse = courseData.filter(
        (course) =>
          course.creator === creatorData?._id && course._id != courseId,
      );
      setCreatorCourses(creatorCourse);
    }
  }, [creatorData, courseData]);
  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const result = await axios.post(
            serverUrl + "/api/course/creator",
            { userId: selectedCourse?.creator },
            { withCredentials: true },
          );
          setCreatorData(result.data);
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to load creator",
          );
        }
      }
    };
    handleCreator();
  }, [selectedCourse]);

  const checkEnrollment = () => {
    const inUserCourses = userData?.enrolledCourses?.some(
      (c) =>
        (typeof c === "string" ? c : c._id).toString() === courseId?.toString(),
    );
    const inCourseStudents = selectedCourse?.enrolledStudents?.some(
      (id) => id.toString() === userData?._id?.toString(),
    );
    if (inUserCourses && inCourseStudents) {
      setIsEnrolled(true);
    } else {
      setIsEnrolled(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
    checkEnrollment();
  }, [courseData, courseId, userData, selectedCourse]);

  const handleEnroll = async (courseId, userId) => {
    try {
      // Load Razorpay script on demand only when user initiates payment
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const orderData = await axios.post(
        serverUrl + "/api/order/razorpay-order",
        { userId, courseId },
        { withCredentials: true },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: "INR",
        name: "VIRTUAL COURSES",
        description: "COURSE ENROLLMENT PAYMENT",
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            const verifyPayment = await axios.post(
              serverUrl + "/api/order/verifypayment",
              { ...response, courseId, userId },
              { withCredentials: true },
            );
            setIsEnrolled(true);
            toast.success(verifyPayment.data.message);
          } catch (error) {
            toast.error(error.response.data.message);
          }
        },
      };
      const rzp = new window.Razorpay(options).open();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleReview = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/review/createreview",
        { courseId, rating, comment },
        { withCredentials: true },
      );
      setLoading(false);
      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
      setRating(0);
      setComment("");
    }
  };

  const calculateAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    const total = reviews.reduce(
      (sum, review) => sum + (review?.rating || 0),
      0,
    );
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAvgReview(selectedCourse?.reviews);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-6 ">
          <div className="w-full md:w-1/2">
            <FaArrowLeftLong
              className="text-[black] w-[22px] h-[22px] cursor-pointer"
              onClick={() => navigate("/")}
            />
            {selectedCourse?.thumbnail ? (
              <img
                src={selectedCourse?.thumbnail}
                alt="Course Thumbnail"
                className="rounded-xl w-full object-cover"
              />
            ) : (
              <img
                src={img}
                alt="Course Thumbnail"
                className="rounded-xl  w-full  object-cover"
              />
            )}
          </div>
          <div className="flex-1 space-y-2 mt-[20px]">
            <h1 className="text-2xl font-bold">{selectedCourse?.title}</h1>
            <p className="text-gray-600">{selectedCourse?.subTitle}</p>

            {/* Rating & Price */}
            <div className="flex items-start flex-col justify-between">
              <div className="text-yellow-500 font-medium flex gap-2">
                ⭐{avgRating}
                <span className="text-gray-500"> (1,200 reviews)</span>
              </div>
              <div>
                <span className="text-xl font-semibold text-black">
                  ₹{selectedCourse?.price}
                </span>{" "}
                <span className="line-through text-sm text-gray-400">
                  ₹1499
                </span>
              </div>
            </div>
            <ul className="text-sm text-gray-700 space-y-1 pt-2">
              <li>✅ 10+ hours of video content</li>
              <li>✅ Lifetime access to course materials</li>
            </ul>
            {/* Enroll Button */}
            {!isEnrolled ? (
              <button
                className="bg-[black] text-white px-6 py-2 rounded hover:bg-gray-700 mt-3"
                onClick={() => handleEnroll(courseId, userData._id)}
              >
                Enroll Now
              </button>
            ) : (
              <button
                className="bg-green-200 text-green-600 px-6 py-2 rounded hover:bg-gray-700 hover:border mt-3"
                onClick={() => navigate(`/viewlecture/${courseId}`)}
              >
                Watch Now
              </button>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">What You’ll Learn</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Learn {selectedCourse?.category} from Beginning</li>
          </ul>
        </div>
        {/* Requirements */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Requirements</h2>
          <p className="text-gray-700">
            Basic programming knowledge is helpful but not required.
          </p>
        </div>

        {/* Who This Course Is For */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Who this course is for?{" "}
          </h2>
          <p className="text-gray-700">
            Beginners, aspiring developers, and professionals looking to upgrade
            skills.
          </p>
        </div>
        {/* course lecture   */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-1 text-gray-800">
              Course Curriculum
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedCourse?.lectures?.length} Lectures
            </p>
            <div className="flex flex-col gap-3">
              {selectedCourse?.lectures?.map((lecture, index) => (
                <button
                  key={index}
                  disabled={!lecture.isPreviewFree}
                  onClick={() => {
                    if (lecture.isPreviewFree) {
                      setSelectedLecture(lecture);
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                    lecture.isPreviewFree
                      ? "hover:bg-gray-100 cursor-pointer border-gray-300"
                      : "cursor-not-allowed opacity-60 border-gray-200"
                  } ${
                    selectedLecture?.lectureTitle === lecture.lectureTitle
                      ? "bg-gray-100 border-gray-400"
                      : ""
                  }`}
                >
                  <span className="text-lg text-gray-700">
                    {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {lecture.lectureTitle}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-black flex items-center justify-center">
              {selectedLecture?.videoUrl ? (
                <video
                  src={selectedLecture.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-sm">
                  Select a preview lecture to watch
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {selectedLecture?.lectureTitle || "Lecture Title"}
            </h3>
            <p className="text-gray-600 text-sm">{selectedCourse?.title}</p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-2">Write a Review</h2>
          {isEnrolled ? (
            <div className="mb-4">
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    onClick={() => setRating(star)}
                    className={
                      rating >= star ? "fill-yellow-400" : "fill-gray-300"
                    }
                  />
                ))}
              </div>
              <textarea
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                placeholder="Write your comment here..."
                className="w-full border border-gray-300 rounded-lg p-2"
                rows="3"
              />
              <button
                className="bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800"
                onClick={handleReview}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader size={30} color="white" />
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          ) : (
            <p className="text-red-600 font-semibold">
              You must enroll in this course to leave a review.
            </p>
          )}
          <div className="flex items-center gap-4 pt-8 border-t">
            {creatorData?.photoUrl ? (
              <img
                src={creatorData?.photoUrl}
                alt="Instructor"
                className="w-16 h-16 rounded-full object-cover border-1 border-gray-200"
              />
            ) : (
              <img
                src={img}
                alt="Instructor"
                className="w-16 h-16 rounded-full object-cover border-1 border-gray-200"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold">{creatorData?.name}</h3>
              <p className="md:text-sm text-gray-600 text-[10px] ">
                {creatorData?.description}
              </p>
              <p className="md:text-sm text-gray-600 text-[10px] ">
                {creatorData?.email}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xl font-semibold mb-">
              Other Published Courses by the Educator -
            </p>
            <div className="w-full transition-all duration-300 py-[20px]   flex items-start justify-center lg:justify-start flex-wrap gap-6 lg:px-[80px] ">
              {creatorCourses?.map((item, index) => (
                <Card
                  key={index}
                  thumbnail={item.thumbnail}
                  title={item.title}
                  id={item._id}
                  price={item.price}
                  category={item.category}
                  reviews={item.reviews}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewCourse;
