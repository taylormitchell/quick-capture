git push origin main
ssh $DROPLET_USER@$DROPLET_IP \
    "cd /home/taylormitchell/code/quick-capture/src && "\
    "git pull origin main && "\
    "PATH=/home/taylormitchell/.nvm/versions/node/v17.7.1/bin:$PATH && "\
    "npm run build"