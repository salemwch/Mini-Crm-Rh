import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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

  notifyUser(userId: string, payload: any) {
    this.server.to(userId).emit('newNotification', payload);
  }
  broadcastNewEventToRH(eventData: any) {
    this.server.to('rh').emit('newEventCreated', eventData);
    this.server.to('admins').emit('newEventCreated', eventData);
  }
}
