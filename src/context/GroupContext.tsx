
import React, { createContext, useContext, useEffect, useState } from 'react';

// Types
export type Participant = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type Item = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  participants: string[]; // Participant IDs
  splitEqually: boolean;
};

export type Group = {
  id: string;
  name: string;
  date: string;
  location?: string;
  participants: Participant[];
  items: Item[];
  createdBy: string;
};

type GroupContextType = {
  groups: Group[];
  currentGroup: Group | null;
  isLoading: boolean;
  createGroup: (group: Omit<Group, 'id'>) => void;
  updateGroup: (group: Group) => void;
  deleteGroup: (groupId: string) => void;
  getGroup: (groupId: string) => Group | null;
  setCurrentGroup: (group: Group | null) => void;
  addItem: (groupId: string, item: Omit<Item, 'id'>) => void;
  updateItem: (groupId: string, item: Item) => void;
  removeItem: (groupId: string, itemId: string) => void;
  addParticipant: (groupId: string, participant: Omit<Participant, 'id'>) => void;
  removeParticipant: (groupId: string, participantId: string) => void;
};

// Mock data
const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Almoço na Cantina',
    date: new Date().toISOString(),
    location: 'Cantina do João',
    participants: [
      { id: '1', name: 'Demo User' },
      { id: '2', name: 'Carlos' },
      { id: '3', name: 'Renata' },
    ],
    items: [
      { 
        id: '1', 
        name: 'Pizza', 
        price: 50, 
        quantity: 1, 
        participants: ['1', '2', '3'], 
        splitEqually: true 
      },
      { 
        id: '2', 
        name: 'Refrigerante', 
        price: 10, 
        quantity: 2, 
        participants: ['1', '3'], 
        splitEqually: true 
      },
    ],
    createdBy: '1',
  },
];

// Create context
const GroupContext = createContext<GroupContextType | undefined>(undefined);

// Provider component
export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Load initial data
  useEffect(() => {
    const storedGroups = localStorage.getItem('fimdefesta_groups');
    if (storedGroups) {
      setGroups(JSON.parse(storedGroups));
    } else {
      setGroups(mockGroups);
      localStorage.setItem('fimdefesta_groups', JSON.stringify(mockGroups));
    }
    setIsLoading(false);
  }, []);

  // Save groups to localStorage whenever they change
  useEffect(() => {
    if (groups.length > 0) {
      localStorage.setItem('fimdefesta_groups', JSON.stringify(groups));
    }
  }, [groups]);

  const createGroup = (group: Omit<Group, 'id'>) => {
    const newGroup = {
      ...group,
      id: Date.now().toString(),
    };
    setGroups([...groups, newGroup]);
  };

  const updateGroup = (updatedGroup: Group) => {
    setGroups(groups.map(group => 
      group.id === updatedGroup.id ? updatedGroup : group
    ));
    if (currentGroup?.id === updatedGroup.id) {
      setCurrentGroup(updatedGroup);
    }
  };

  const deleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId));
    if (currentGroup?.id === groupId) {
      setCurrentGroup(null);
    }
  };

  const getGroup = (groupId: string): Group | null => {
    return groups.find(group => group.id === groupId) || null;
  };

  const addItem = (groupId: string, item: Omit<Item, 'id'>) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      const newItem = {
        ...item,
        id: Date.now().toString(),
      };
      const updatedGroup = {
        ...group,
        items: [...group.items, newItem],
      };
      updateGroup(updatedGroup);
    }
  };

  const updateItem = (groupId: string, updatedItem: Item) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      const updatedGroup = {
        ...group,
        items: group.items.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        ),
      };
      updateGroup(updatedGroup);
    }
  };

  const removeItem = (groupId: string, itemId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      const updatedGroup = {
        ...group,
        items: group.items.filter(item => item.id !== itemId),
      };
      updateGroup(updatedGroup);
    }
  };

  const addParticipant = (groupId: string, participant: Omit<Participant, 'id'>) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      const newParticipant = {
        ...participant,
        id: Date.now().toString(),
      };
      const updatedGroup = {
        ...group,
        participants: [...group.participants, newParticipant],
      };
      updateGroup(updatedGroup);
    }
  };

  const removeParticipant = (groupId: string, participantId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      const updatedGroup = {
        ...group,
        participants: group.participants.filter(p => p.id !== participantId),
        items: group.items.map(item => ({
          ...item,
          participants: item.participants.filter(p => p !== participantId),
        })),
      };
      updateGroup(updatedGroup);
    }
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        currentGroup,
        isLoading,
        createGroup,
        updateGroup,
        deleteGroup,
        getGroup,
        setCurrentGroup,
        addItem,
        updateItem,
        removeItem,
        addParticipant,
        removeParticipant,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

// Hook to use group context
export const useGroups = () => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupProvider');
  }
  return context;
};
