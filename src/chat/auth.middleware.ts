// import { JwtService } from '@nestjs/jwt';
// import { Socket } from 'socket.io';
// import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
// import { Player } from 'src/typs';
// import { UserService } from 'src/user/user.service';

// export interface AuthSocket extends Socket {
//   user: Player;
// }
// export type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void
// export const WSAuthMiddleware = (jwtService:JwtService, userService:UserService):SocketMiddleware =>{
//   return async (socket:AuthSocket, next) => {
//     try {
//       const jwtPayload = jwtService.verify(
//         socket.handshake.auth.jwt ?? '',
//       ) as JwtPayload;
//       const userResult = await userService.getUser(jwtPayload.userID);
//       if (userResult.isSuccess) {
//         socket.user = userResult.data;
//         next();
//       } else {
//         next({
//           name: 'Unauthorizaed',
//           message: 'Unauthorizaed',
//         });
//       }
//     } catch (error) {
//       next({
//         name: 'Unauthorizaed',
//         message: 'Unauthorizaed',
//       });
//     }
//   }
// }