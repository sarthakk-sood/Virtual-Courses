import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setUserData, setLoading } from "../redux/userSlice";
import axios from "axios";
const getCurrentUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/getcurrentuser", {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
      } catch (error) {
        dispatch(setUserData(null));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchUser();
  }, []);
};

export default getCurrentUser;
