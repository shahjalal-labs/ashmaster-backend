    sudo apt install certbot python3-certbot-nginx -y
    sudo certbot --nginx -d bridgesystemllc.com -d bridgesystemllc.com

server{
server_name api.bridgesystemllc.com;
root /var/www/ashmaster-backend;

        location / {
            proxy_pass http://localhost:6011;
            proxy_http_version 1.1;

            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        client_max_body_size 3000M;
    }

    "start": "concurrently \"node ./dist/server.js\" \"node ./dist/workers/emailWorker.js\" \"node ./dist/workers/notificationWorker.js\"",
