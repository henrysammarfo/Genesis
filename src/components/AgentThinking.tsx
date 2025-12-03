'use client';

import { useEffect, useState } from 'react';
import styles from './AgentThinking.module.css';

interface AgentStatus {
    agent: 'architect' | 'engineer' | 'designer' | 'deployer';
    message: string;
    timestamp: number;
}

export default function AgentThinking() {
    const [currentAgent, setCurrentAgent] = useState<AgentStatus | null>(null);
    const [completedAgents, setCompletedAgents] = useState<string[]>([]);

    const agentIcons = {
        architect: '🧠',
        engineer: '⚙️',
        designer: '🎨',
        deployer: '🚀',
    };

    const agentLabels = {
        architect: 'Planning',
        engineer: 'Coding',
        designer: 'Designing',
        deployer: 'Deploying',
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.pulse}></div>
                <h3>AI Agents Working</h3>
            </div>

            <div className={styles.agentList}>
                {(['architect', 'engineer', 'designer', 'deployer'] as const).map((agent) => {
                    const isActive = currentAgent?.agent === agent;
                    const isCompleted = completedAgents.includes(agent);
                    const isPending = !isActive && !isCompleted;

                    return (
                        <div
                            key={agent}
                            className={`${styles.agentItem} ${isActive ? styles.active : isCompleted ? styles.completed : styles.pending
                                }`}
                        >
                            <div className={styles.agentIcon}>{agentIcons[agent]}</div>
                            <div className={styles.agentInfo}>
                                <div className={styles.agentName}>{agentLabels[agent]}</div>
                                {isActive && currentAgent && (
                                    <div className={styles.agentMessage}>{currentAgent.message}</div>
                                )}
                                {isCompleted && <div className={styles.agentStatus}>✓ Complete</div>}
                                {isPending && <div className={styles.agentStatus}>Waiting...</div>}
                            </div>
                            {isActive && (
                                <div className={styles.spinner}>
                                    <div className={styles.spinnerDot}></div>
                                    <div className={styles.spinnerDot}></div>
                                    <div className={styles.spinnerDot}></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Export hook for controlling the component
export function useAgentThinking() {
    const [currentAgent, setCurrentAgent] = useState<AgentStatus | null>(null);
    const [completedAgents, setCompletedAgents] = useState<string[]>([]);

    const updateAgent = (agent: AgentStatus['agent'], message: string) => {
        setCurrentAgent({ agent, message, timestamp: Date.now() });
    };

    const completeAgent = (agent: AgentStatus['agent']) => {
        setCompletedAgents((prev) => [...prev, agent]);
        setCurrentAgent(null);
    };

    const reset = () => {
        setCurrentAgent(null);
        setCompletedAgents([]);
    };

    return {
        currentAgent,
        completedAgents,
        updateAgent,
        completeAgent,
        reset,
    };
}
