import { useContext, useEffect, useState } from 'react';
import Conversation from './Conversation';
import { createGroup, getUserGroups } from '../../service/conversation';
import { AuthContext } from '../../components/AuthProvider';

export default function ChatWidget() {
 const { user } = useContext(AuthContext);
const [groupId, setGroupId] = useState(null);
const [isOpen, setIsOpen] = useState(false);
const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

const handleOpenCreateGroup = () => {
  setIsCreateGroupOpen(true);
};

const handleCloseCreateGroup = () => {
  setIsCreateGroupOpen(false);
};

useEffect(() => {
  const initGroup = async () => {
    console.log('[InitGroup] useEffect triggered.');

    if (!user || !user.id) {
      console.warn('[InitGroup] No user or user.id found. Skipping group initialization.');
      return;
    }
    console.log(`[InitGroup] Found user: ${user.fullName} (ID: ${user.id})`);
    try {
      const groups = await getUserGroups(user.id);
      console.log('[InitGroup] Fetched groups:', groups);

      if (groups?.length) {
        console.log('[InitGroup] Existing group found. Using first group ID:', groups[0].id);
        setGroupId(groups[0]._id);
      } else {
        console.log('[InitGroup] No groups found. Creating a new one...');

        const newGroup = await createGroup({
          name: `Chat with ${user.fullName}`,
          members: [],
        });

        console.log('[InitGroup] New group created:', newGroup);
        setGroupId(newGroup.id);
      }

    } catch (err) {
      console.error('[InitGroup] Error during group initialization:', err);
    }
  };

  initGroup();
}, [user]);

if (!user) return <div>Please log in to chat</div>;
if (!groupId) return <div>Loading chat...</div>;


  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 350,
        height: isOpen ? 450 : 50,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        borderRadius: 8,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
        <button
  onClick={handleOpenCreateGroup}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  + Create Group
</button>

      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '10px',
          cursor: 'pointer',
          userSelect: 'none',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Group Chat {isOpen ? '−' : '+'}
      </div>
      {isOpen && groupId && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Conversation groupId={groupId} currentUser={user} />
        </div>
      )}
    </div>
  );
}
