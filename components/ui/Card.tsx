import React from 'react';
import { cn } from '../../lib/utils';
import { THEME } from '../../lib/constants';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "glass-card rounded-2xl p-8 relative overflow-hidden group transition-all duration-500 hover:translate-y-[-4px]",
                    className
                )}
                {...props}
            >
                {/* Subtle highlight effect */}
                <div className="absolute top-0 left-0 w-full h-1 premium-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {title && (
                    <h3 className="mb-6 text-lg font-bold tracking-tight text-white/90 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[#E90052]/50 group-hover:bg-[#E90052] transition-colors" />
                        {title}
                    </h3>
                )}
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        );
    }
);
Card.displayName = "Card";
