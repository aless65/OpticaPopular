import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// routes
import { PATH_AUTH } from '../routes/paths';
// hooks
import useAuth from '../hooks/useAuth';
// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default function GuestGuard({ children }) {

  if (localStorage.getItem("usuario") === null) {
    return <Navigate to={PATH_AUTH.login} />;
  }

  return <>{children}</>;
}
