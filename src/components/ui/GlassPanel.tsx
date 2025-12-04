import React from 'react';
import styles from './GlassPanel.module.css';

interface GlassPanelProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    badge?: string;
    headerAction?: React.ReactNode;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
    children,
    className = '',
    title,
    badge,
    headerAction
}) => {
    return (
        <div className={`${styles.panel} ${className}`}>
            {(title || badge || headerAction) && (
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        {title && <h2 className={styles.title}>{title}</h2>}
                        {badge && <span className={styles.badge}>{badge}</span>}
                    </div>
                    {headerAction && <div className={styles.action}>{headerAction}</div>}
                </div>
            )}
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};
