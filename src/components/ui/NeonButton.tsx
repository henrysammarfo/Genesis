import React from 'react';
import styles from './NeonButton.module.css';
import { Loader2 } from 'lucide-react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    disabled,
    ...props
}) => {
    return (
        <button
            className={`
        ${styles.button} 
        ${styles[variant]} 
        ${styles[size]} 
        ${isLoading ? styles.loading : ''} 
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className={styles.spinner} size={16} />}
            {!isLoading && icon && <span className={styles.icon}>{icon}</span>}
            <span className={styles.label}>{children}</span>

            {variant === 'primary' && !disabled && !isLoading && (
                <div className={styles.glow} />
            )}
        </button>
    );
};
