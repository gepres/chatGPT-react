import { NavLink } from "react-router-dom"

interface SidebarMenuItemProps {
 to: string;
 icon: string;
 title: string;
 description: string;
}

export const SidebarMenuItem = ({ to, icon, title, description }: SidebarMenuItemProps) => {
  return (
    <NavLink
    to={to}
    className={({ isActive }) => isActive ? 'flex justify-center items-center bg-gray-800 rounded-md p-2 transition-colors' : 'flex justify-center items-center hover:bg-gray-800 rounded-md p-2 transition-colors'}
  >
    <i className={` text-2xl mr-4 text-indigo-400 ${icon}`} />
    <div className="flex flex-col flex-grow">
    <span className="text-lg text-white font-semibold">{title}</span>
    <span className="text-sm text-gray-400">{description}</span>
    </div>
  </NavLink>
  )
}
