import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationService } from 'src/Conversation/conversation.service';
import { UserRole } from 'src/user/dto/create-user.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(private readonly conversationService: ConversationService) {}
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { groupId: string; content: string; senderId: string },
  ) {
    const message = await this.conversationService.sendMessage(payload.senderId, {
      groupId: payload.groupId,
      content: payload.content,
    });

    this.server.to(payload.groupId).emit('newMessage', message);
  }
  private connectedUsers: Set<string> = new Set();

  handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId as string;
    const role = client.handshake.auth.role as string;
    console.log('Socket connected:', client.id, 'Auth:', client.handshake.auth);

    if (userId) {
      this.connectedUsers.add(userId);
      client.join(userId);
      console.log(`Client joined room: ${userId}`);

      this.server.emit('onlineUsers', Array.from(this.connectedUsers));
    }

    if (role === UserRole.ADMIN) {
      client.join('admins');
    };
    if (role === UserRole.RH) {
      client.join('rh');
    };
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId as string;

    if (userId && this.connectedUsers.has(userId)) {
      this.connectedUsers.delete(userId);

      this.server.emit('onlineUsers', Array.from(this.connectedUsers));
    }
  }
  @SubscribeMessage('joinGroup')
  handleJoinGroup(client: Socket, groupId: string) {
    client.join(groupId);
    console.log(`User ${client.id} joined group room ${groupId}`);
  }

  @SubscribeMessage('leaveGroup')
  handleLeaveGroup(client: Socket, groupId: string) {
    client.leave(groupId);
    console.log(`User ${client.id} left group room ${groupId}`);
  }

  notifyUser(userId: string, payload: any) {
    this.server.to(userId).emit('newNotification', payload);
  }
  broadcastNewEventToRH(eventData: any) {
    this.server.to('rh').emit('newEventCreated', eventData);
    this.server.to('admins').emit('newEventCreated', eventData);
  }
  sendMessageToGroup(groupId: string, message: any) {
    this.server.to(groupId).emit('newMessage', message);
  }
  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { groupId: string; userId: string }
  ) {
    this.server.to(data.groupId).emit('userTyping', data);
  }

}
