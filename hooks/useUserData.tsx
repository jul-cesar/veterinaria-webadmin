import { userData } from "@/types/userdata";
import { useState, useEffect } from "react";

const useUserData = () => {
  const [userData, setUserData] = useState<userData>();

  useEffect(() => {
    try {
      const data = localStorage.getItem("user");
      if (data) {
        setUserData(JSON.parse(data)); // Parse and set the data
      }
    } catch (error) {
      console.error(
        `Error retrieving user data from localStorage key "user":`,
        error
      );
    }
  }, []);

  return userData;
};

export default useUserData;
