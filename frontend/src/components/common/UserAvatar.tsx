import React from 'react'

interface UserAvatarProps {
    name: string;
    className?: string;
}

const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
        return "?";
    }

    if (words.length === 1) {
        return words[0][0].toUpperCase();
    }

    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};


const UserAvatar: React.FC<UserAvatarProps> = ({
    name,
    className = "",
}) => {
    const initials = getInitials(name);

    return (
        <div
            className={`avatar ${className} `}
            title={name}
            aria-label={`Avatar de ${name}`}
        >
            {initials}
        </div>
    );
};

export default UserAvatar;