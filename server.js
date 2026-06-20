const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { Client } = require('ssh2');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

function safeSend(ws, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(data);
  }
}

wss.on('connection', (ws) => {
  let conn = null;
  let sshStream = null;

  console.log('Client connected to WebSocket');

  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message);

      if (msg.type === 'connect') {
        if (conn) {
          ws.send(JSON.stringify({ type: 'status', message: 'Already connected', level: 'warning' }));
          return;
        }

        const port = parseInt(msg.port);
        if (isNaN(port) || port < 1 || port > 65535) {
          ws.send(JSON.stringify({ type: 'error', message: 'Port ไม่ถูกต้อง (ต้องอยู่ระหว่าง 1-65535)' }));
          return;
        }

        ws.send(JSON.stringify({ type: 'status', message: 'กำลังเชื่อมต่อ SSH...', level: 'info' }));

        conn = new Client();

        conn.on('ready', () => {
          safeSend(ws, JSON.stringify({ type: 'status', message: 'เชื่อมต่อสำเร็จ! กำลังสร้าง Shell...', level: 'info' }));

          const cols = msg.cols || 80;
          const rows = msg.rows || 24;

          conn.shell({ term: 'xterm-256color', cols, rows }, (err, stream) => {
            if (err) {
              safeSend(ws, JSON.stringify({ type: 'error', message: `ไม่สามารถเปิด Shell: ${err.message}` }));
              conn.end();
              conn = null;
              return;
            }

            sshStream = stream;

            safeSend(ws, JSON.stringify({ type: 'status', message: 'เชื่อมต่อเสร็จสมบูรณ์', level: 'success' }));

            sshStream.on('data', (data) => {
              safeSend(ws, JSON.stringify({ type: 'data', data: Buffer.from(data).toString('base64'), encoding: 'base64' }));
            });

            sshStream.on('close', () => {
              safeSend(ws, JSON.stringify({ type: 'status', message: 'เซสชัน Shell ถูกปิดลง', level: 'info' }));
              if (ws.readyState === WebSocket.OPEN) ws.close();
            });
          });
        });

        conn.on('error', (err) => {
          console.error('SSH Client Error:', err);
          safeSend(ws, JSON.stringify({ type: 'error', message: `ข้อผิดพลาด SSH: ${err.message}` }));
        });

        conn.on('close', () => {
          safeSend(ws, JSON.stringify({ type: 'status', message: 'การเชื่อมต่อ SSH ถูกปิด', level: 'info' }));
          conn = null;
          sshStream = null;
        });

        conn.connect({
          host: msg.host,
          port,
          username: msg.username,
          password: msg.password,
          keepaliveInterval: 10000,
          keepaliveCountMax: 3
        });

      } else if (msg.type === 'input') {
        if (sshStream) {
          sshStream.write(msg.data);
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'กรุณาเชื่อมต่อ SSH ก่อนส่งคำสั่ง' }));
        }

      } else if (msg.type === 'resize') {
        if (sshStream) {
          sshStream.setWindow(msg.rows, msg.cols, 0, 0);
        }
      }

    } catch (e) {
      console.error('Error handling WebSocket message:', e);
      ws.send(JSON.stringify({ type: 'error', message: 'ข้อมูลร้องขอไม่ถูกต้อง' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
    if (sshStream) {
      sshStream.end();
      sshStream = null;
    }
    if (conn) {
      conn.end();
      conn = null;
    }
  });
});

server.listen(PORT, () => {
  console.log(`Web SSH Client server is running on http://localhost:${PORT}`);
});
