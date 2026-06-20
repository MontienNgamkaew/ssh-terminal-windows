# Montien Tech Terminal

Web-based SSH Terminal สไตล์ Retro 16-bit สำหรับ Windows รองรับภาษาไทย พร้อม PWA offline support

## ความต้องการของระบบ

- [Node.js](https://nodejs.org/) v18 ขึ้นไป
- Windows 10/11

## การติดตั้ง

```bash
git clone <repo-url>
cd ssh_windows
npm install
```

## การใช้งาน

### เริ่ม Server (ครั้งแรก)

```bash
node server.js
```

จากนั้นเปิด browser ไปที่ `http://localhost:3000`

### ตั้งค่าให้รันอัตโนมัติเมื่อเปิดเครื่อง (แนะนำ)

ใช้ pm2 เพื่อให้ server รันเองโดยไม่ต้องเปิด terminal:

```bash
npm install -g pm2
pm2 start server.js --name "ssh-terminal"
pm2 save
```

จากนั้นสร้างไฟล์ `ssh-terminal-pm2.bat` ใน Windows Startup folder:

```
C:\Users\<ชื่อผู้ใช้>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\
```

เนื้อหาไฟล์:
```bat
@echo off
pm2 resurrect
```

หลังจากนี้เปิดเครื่องมาแล้วเข้า `http://localhost:3000` ได้เลย โดยไม่ต้องทำอะไรเพิ่ม

## ฟีเจอร์

- เชื่อมต่อ SSH ผ่าน browser
- รองรับภาษาไทยและ UTF-8 เต็มรูปแบบ (Base64 binary transport)
- Multi-tab SSH sessions
- Auto-reconnect เมื่อการเชื่อมต่อขาด (สูงสุด 5 ครั้ง)
- บันทึก SSH Profile (host, username, port, password)
- ประวัติคำสั่ง (กด ↑/↓ เพื่อเรียกดู)
- ธีม terminal: Dracula, macOS Dark, Monokai, Solarized Dark, Retro Green, Retro Amber
- Mascot 8-bit: Dino, Cyber Cat, PacGhost, Tiny Robot
- PWA — ติดตั้งเป็น app บน desktop ได้
- Offline support ผ่าน Service Worker

## คีย์ลัด

| คีย์ | ฟังก์ชัน |
|------|---------|
| `Ctrl + Space` | สลับ focus ระหว่าง Terminal ↔ Command Input Bar |
| `↑ / ↓` | เรียกดูประวัติคำสั่ง (ขณะอยู่ใน Command Input Bar) |
| `Enter` | ส่งคำสั่ง (เมื่อเปิด "Enter รันทันที") |

## โครงสร้างโปรเจค

```
ssh_windows/
├── server.js          # Express + WebSocket + SSH2 backend
├── public/
│   ├── index.html     # UI หลัก
│   ├── app.js         # Frontend logic
│   ├── style.css      # Styles
│   ├── service-worker.js  # PWA offline cache
│   └── manifest.json  # PWA manifest
└── package.json
```

## การจัดการ pm2

```bash
pm2 list              # ดู process ทั้งหมด
pm2 logs ssh-terminal # ดู log
pm2 restart ssh-terminal  # restart server
pm2 stop ssh-terminal     # หยุด server
```
