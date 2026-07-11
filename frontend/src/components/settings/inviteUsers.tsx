import { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/CSS/settings/inviteUsers.css";

interface UserSearchDTO {
    id: number;
    username: string;
    email: string;
}

interface InviteUsersProps {
    isOpen: boolean;
    projectId: number;
    onClose: () => void;
    onInvited: () => void;
}

export default function InviteUsers({
    isOpen,
    projectId,
    onClose,
    onInvited
}: InviteUsersProps){

    if (!isOpen) return null;

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<UserSearchDTO[]>([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            return;
        }

        const timeout = setTimeout(() => {
            searchUsers();
        }, 300);

        return () => clearTimeout(timeout);

    }, [query]);

    const searchUsers = async () => {
        try {

            setLoading(true);

            console.log("Searching for users with query:", query);
            console.log("Using id: ", projectId);

            const res = await axios.get(
                `http://localhost:8080/api/auth/members/search`,
                {
                    params: {
                        projectId,
                        query
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Search response:", res.data);

            setResults(res.data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }
    };

    const invite = async (userId: number) => {
        try {

            await axios.post(
                `http://localhost:8080/api/projects/${projectId}/settings/members/${userId}`,
                { userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Remove invited user from results
            setResults(results.filter(u => u.id !== userId));

            if (onInvited) {
                onInvited();
            }

        } catch (err) {

            console.error(err);

        }
    };

    return (

        <div className="modal-overlay">

        <div className="invite-modal">

            <div className="modal-header">

                <h2>Invite Member</h2>

                <button
                    className="close-btn"
                    onClick={onClose}
                >
                    ✕
                </button>

            </div>
        <div className="invite-users">

            <input
                className="invite-search"
                type="text"
                placeholder="Search username or email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {loading && (
                <div className="invite-loading">
                    Searching...
                </div>
            )}

            {!loading && results.length === 0 && query !== "" && (
                <div className="invite-empty">
                    No users found.
                </div>
            )}

            <div className="invite-results">

                {results.map(user => (

                    <div
                        className="invite-user-card"
                        key={user.id}
                    >

                        <div className="invite-avatar">
                            {user.username[0].toUpperCase()}
                        </div>

                        <div className="invite-info">

                            <h3>{user.username}</h3>

                            <p>{user.email}</p>

                        </div>

                        <button
                            className="invite-btn"
                            onClick={() => invite(user.id)}
                        >
                            Invite
                        </button>

                    </div>

                ))}

            </div>

        </div>
         </div>

    </div>
    );
}