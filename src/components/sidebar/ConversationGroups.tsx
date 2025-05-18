
import React from 'react';
import { Conversation } from '@/types/chat';
import { ConversationItem } from './ConversationItem';

interface ConversationGroupsProps {
  groupedConversations: {
    today: Conversation[];
    yesterday: Conversation[];
    pastWeek: Conversation[];
    pastMonth: Conversation[];
    older: Conversation[];
  };
  currentConversationId: string | null;
  editingId: string | null;
  editTitle: string;
  collapsed: boolean;
  setCurrentConversation: (id: string) => void;
  handleStartEdit: (id: string, title: string) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  setEditTitle: (title: string) => void;
  handleDeleteClick: (id: string) => void;
}

export const ConversationGroups: React.FC<ConversationGroupsProps> = ({
  groupedConversations,
  currentConversationId,
  editingId,
  editTitle,
  collapsed,
  setCurrentConversation,
  handleStartEdit,
  handleSaveEdit,
  handleCancelEdit,
  handleKeyDown,
  setEditTitle,
  handleDeleteClick
}) => {
  const renderConversationItem = (chat: any) => {
    return (
      <ConversationItem
        key={chat.id}
        chat={chat}
        currentConversationId={currentConversationId}
        editingId={editingId}
        editTitle={editTitle}
        collapsed={collapsed}
        onSelect={setCurrentConversation}
        onStartEdit={handleStartEdit}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        onKeyDown={handleKeyDown}
        onEditChange={(value) => setEditTitle(value)}
        onDeleteClick={handleDeleteClick}
      />
    );
  };

  const renderConversationGroup = (title: string, conversations: Conversation[]) => {
    if (conversations.length === 0) return null;
    return (
      <div key={title}>
        {!collapsed && (
          <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
            {title}
          </div>
        )}
        
        <div className="space-y-1 mb-3">
          {conversations.map(chat => renderConversationItem(chat))}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderConversationGroup("Today", groupedConversations.today)}
      {renderConversationGroup("Yesterday", groupedConversations.yesterday)}
      {renderConversationGroup("Previous 7 Days", groupedConversations.pastWeek)}
      {renderConversationGroup("Previous 30 Days", groupedConversations.pastMonth)}
      {renderConversationGroup("Older", groupedConversations.older)}
    </>
  );
};
