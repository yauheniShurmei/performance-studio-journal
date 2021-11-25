import { useEffect } from "react";
import { useNavigate } from "react-router";

const Custom404 = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  });
  return null;
};

export default Custom404;
