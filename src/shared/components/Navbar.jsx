import { NavLink } from "react-router-dom";
import { useNotification } from "@/contexts/useNotification";

import bellIcon from "@/images/nav_bell_icon.svg";
import bookmarkIcon from "@/images/nav_bookmark_icon.svg";
import homeIcon from "@/images/nav_home_icon.svg";
import userIcon from "@/images/nav_user_icon.svg";
import "./navbar.css";

export default function Navbar() {
  const { unreadCount } = useNotification();

  const hasUnread = unreadCount > 0;

  const linkCls = ({ isActive }) => "nav-item" + (isActive ? " active" : "");

  return (
    <nav className="Navbar" aria-label="Bottom Navigation">
      <NavLink replace to="/main" className={linkCls} aria-label="Main">
        <img src={homeIcon} alt="" />
      </NavLink>

      <NavLink replace to="/bookmark" className={linkCls} aria-label="Bookmark">
        <img src={bookmarkIcon} alt="" />
      </NavLink>

      <NavLink
        replace
        to="/notification"
        className={linkCls}
        aria-label="Notifications"
      >
        <span className="icon-wrap">
          <img src={bellIcon} alt="" />
          {hasUnread && <span className="dot" aria-label="unread" />}
        </span>
      </NavLink>

      <NavLink replace to="/profile" className={linkCls} aria-label="Profile">
        <img src={userIcon} alt="" />
      </NavLink>
    </nav>
  );
}
