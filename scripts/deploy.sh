git push origin main
ssh $DROPLET_USER@$DROPLET_IP "cd ~/code/quick-capture && git pull origin main"
ssh $DROPLET_USER@$DROPLET_IP "pm2 restart quick-capture"