// notification.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
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
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId as string;
    console.log('Socket connected:', client.id, 'Auth:', client.handshake.auth);

    const role = client.handshake.auth.role as string;
    if (userId) {
      client.join(userId);
      console.log(`Client joined room: ${userId}`);
    }
    if (role === UserRole.ADMIN) {
      client.join('admins');
    }
  }

  notifyUser(userId: string, payload: any) {
    this.server.to(userId).emit('newNotification', payload);
  }
}