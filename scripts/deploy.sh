git push origin main
ssh $DROPLET_USER@$DROPLET_IP "cd /home/taylormitchell/code/quick-capture/src && git pull origin main && npm run build"