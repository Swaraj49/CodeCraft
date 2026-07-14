function UserList({users = [], username}) {
    const totalUsers = users.length + 1; // +1 for "you"

    const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

    return(
        <aside className="sidebar">
            <div className="sidebar-header">
                Explorer
            </div>

            <div className="sidebar-section-title">Users in Room</div>

            <div className="sidebar-users">
                {/* Current user (you) */}
                <div className="user-item">
                    <div className="online-indicator" />
                    <div className="user-avatar">
                        {getInitial(username)}
                    </div>
                    <span className="user-name you" title={username}>
                        {username}
                    </span>
                    <span className="user-badge">you</span>
                </div>

                {/* Other users */}
                {users.map((user, index) => (
                    <div className="user-item" key={index}>
                        <div className="online-indicator" />
                        <div className="user-avatar other">
                            {getInitial(user)}
                        </div>
                        <span className="user-name" title={user}>
                            {user}
                        </span>
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <div className="sidebar-count">
                    <span className="sidebar-count-num">{totalUsers}</span>
                    online
                </div>
            </div>
        </aside>
    );
}

export default UserList;