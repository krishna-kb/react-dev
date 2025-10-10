import React from "react";

// Define the User type again for props, or import from a shared types file
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
  jobTitle: string;
}

interface RowProps {
  user: User;
}

// The actual Row component
const TableRow: React.FC<RowProps> = ({ user }) => {
  return (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>{user.email}</td>
      <td>{user.city}</td>
      <td>{user.country}</td>
      <td>{user.jobTitle}</td>
    </tr>
  );
};

// Memoize the component to prevent re-renders if props are unchanged
export const MemoizedRow = React.memo(TableRow);
