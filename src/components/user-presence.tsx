'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const users = [
  { name: 'Alice', color: '#ef4444', id: 1 },
  { name: 'Bob', color: '#3b82f6', id: 2 },
  { name: 'Charlie', color: '#22c55e', id: 3 },
  { name: 'You', color: '#8b5cf6', id: 4 },
];

interface UserPresenceProps {
    orientation?: 'horizontal' | 'vertical';
}

export function UserPresence({ orientation = 'horizontal' }: UserPresenceProps) {

  if (orientation === 'vertical') {
    return (
        <ul className="space-y-3">
            {users.map((user) => (
                <li key={user.name} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://picsum.photos/40/40?random=${user.id}`} alt={user.name} />
                        <AvatarFallback style={{ backgroundColor: user.color }} className="text-white font-bold">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                </li>
            ))}
        </ul>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2">
        <div className="flex -space-x-2 overflow-hidden">
          {users.map((user) => (
            <Tooltip key={user.name}>
              <TooltipTrigger asChild>
                <Avatar className="h-9 w-9 border-2 border-background cursor-pointer">
                  <AvatarImage src={`https://picsum.photos/40/40?random=${user.id}`} alt={user.name} />
                  <AvatarFallback style={{ backgroundColor: user.color }} className="text-white font-bold">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <span className="text-sm font-medium text-muted-foreground hidden sm:block">{users.length} users online</span>
      </div>
    </TooltipProvider>
  );
}
