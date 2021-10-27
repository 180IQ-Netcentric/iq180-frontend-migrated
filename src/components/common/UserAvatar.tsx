import React from "react";

type Props = {
  text: string;
};

const UserAvatar = ({ text }: Props) => {
  return (
    <div className="user-avatar">
      <p>{text?.charAt(0).toUpperCase()}</p>
    </div>
  );
};

export default UserAvatar;
