import { MessageInbox } from '../features/messaging/components/MessageInbox';

export default function Messages() {
  return (
    <div className="pt-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <MessageInbox />
    </div>
  );
}