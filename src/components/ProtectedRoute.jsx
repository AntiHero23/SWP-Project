import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "../redux/features/counterSlice";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, allowedRoles, requirePremium }) => {
  const user = useSelector(selectUser);

  // console.log("User object:", user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role permissions
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "ADMIN":
        return <Navigate to="/admin" replace />;
      case "SHOP":
        return <Navigate to="/shop" replace />;
      default:
        return <Navigate to="/home" replace />;
    }
  }

  // Check premium status for member features
  if (
    requirePremium &&
    user.role === "MEMBER" &&
    user.premiumStatus !== 1 &&
    user.premiumStatus !== "1"
  ) {
    return <Navigate to="/buyPlan" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(
    PropTypes.oneOf(["ADMIN", "SHOP", "MEMBER"]) // Explicitly define allowed role values
  ),
  requirePremium: PropTypes.bool,
};

// Add default props (optional)
ProtectedRoute.defaultProps = {
  allowedRoles: null,
  requirePremium: false,
};

export default ProtectedRoute;
