import styles from './ConversationList.module.css';

interface Conversation {
  id: string;
  adopter_id: string;
  shelter_id: string;
  pet_id?: string;
  created_at: string;
  adopter?: { id: string; name: string };
  shelter?: { id: string; name: string };
  pet?: { id: string; name: string };
}

interface Props {
  conversations: Conversation[];
  activeConversationId?: string | null;
  isLoading: boolean;
  currentUserId: string;
  onSelect: (id: string) => void;
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return <div className={styles.avatar}>{initials}</div>;
}

export function ConversationList({
  conversations,
  activeConversationId,
  isLoading,
  onSelect,
}: Props) {
  if (isLoading) {
    return (
      <div className={styles.state}>
        <span className={styles.stateIcon}>⏳</span>
        <p>Loading conversations…</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className={styles.state}>
        <span className={styles.stateIcon}>📭</span>
        <p>No conversations yet.</p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {conversations.map((conv) => {
        const isActive = conv.id === activeConversationId;
        const name = conv.adopter?.name ?? 'Adopter';
        const pet = conv.pet?.name;

        return (
          <li key={conv.id}>
            <button
              className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
              onClick={() => onSelect(conv.id)}
            >
              <Avatar name={name} />
              <div className={styles.itemBody}>
                <span className={styles.itemName}>{name}</span>
                {pet && <span className={styles.itemPet}>🐾 {pet}</span>}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}