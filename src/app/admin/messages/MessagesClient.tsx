'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash, FaCheckCircle, FaCircle } from 'react-icons/fa';
import styles from './messages.module.css';

interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export default function MessagesClient({ initialMessages }: { initialMessages: Message[] }) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const router = useRouter();

    const handleToggleRead = async (id: string, currentReadStatus: boolean) => {
        const res = await fetch(`/api/messages/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ read: !currentReadStatus }),
        });

        if (res.ok) {
            setMessages(messages.map(m => m.id === id ? { ...m, read: !currentReadStatus } : m));
            router.refresh();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setMessages(messages.filter(m => m.id !== id));
            router.refresh();
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Messages ({messages.filter(m => !m.read).length} Unread)</h1>
            <div className={styles.list}>
                {messages.length === 0 ? (
                    <p className={styles.emptyState}>No messages yet.</p>
                ) : (
                    messages.map(msg => (
                        <div key={msg.id} className={`${styles.card} ${!msg.read ? styles.unread : ''}`}>
                            <div className={styles.header}>
                                <div>
                                    <h3 className={styles.name}>{msg.name}</h3>
                                    <a href={`mailto:${msg.email}`} className={styles.email}>{msg.email}</a>
                                </div>
                                <div className={styles.date}>
                                    {new Date(msg.createdAt).toLocaleString()}
                                </div>
                            </div>
                            <p className={styles.messageBody}>{msg.message}</p>
                            <div className={styles.actions}>
                                <button onClick={() => handleToggleRead(msg.id, msg.read)} className={styles.iconButton} title={msg.read ? "Mark Unread" : "Mark Read"}>
                                    {msg.read ? <FaCheckCircle style={{ color: 'var(--text-secondary)' }} /> : <FaCircle style={{ color: 'var(--accent)' }} />}
                                    <span style={{ marginLeft: '8px', fontSize: '0.85rem' }}>{msg.read ? 'Read' : 'Unread'}</span>
                                </button>
                                <button onClick={() => handleDelete(msg.id)} className={styles.iconButtonDelete} title="Delete">
                                    <FaTrash />
                                    <span style={{ marginLeft: '8px', fontSize: '0.85rem' }}>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
