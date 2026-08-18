/**
 * Socket.io Real-time Event Handler for Workspace Sync
 * @param {import('socket.io').Server} io 
 */
export const registerWorkspaceSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // Join user room for private workspace sync
    socket.on('join:user', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`[WebSocket] Socket ${socket.id} joined user:${userId}`);
      }
    });

    // Join workspace room for collaborative workspace sync
    socket.on('join:workspace', (workspaceId) => {
      if (workspaceId) {
        socket.join(`workspace:${workspaceId}`);
        console.log(`[WebSocket] Socket ${socket.id} joined workspace:${workspaceId}`);
      }
    });

    // Broadcast workspace tab update
    socket.on('workspace:sync', (data) => {
      const { workspaceId, userId } = data;
      if (userId) {
        socket.to(`user:${userId}`).emit('workspace:updated', data);
      }
      if (workspaceId) {
        socket.to(`workspace:${workspaceId}`).emit('workspace:updated', data);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });
};
