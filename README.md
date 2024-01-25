# Test data generator on opc ua interface
### by simulation 3d printer and setting parameters at OPC UA
## docker and kubernetes ready


docker login --username username

docker-compoe --bulid
docker-compose up


sudo k3s kubectl create secret docker-registry registrysecret
--docker-server='https://index.docker.io/v1/'
--docker-username='<user>'
--docker-password='<pass>'

sudo k3s kubectl apply -f deployment.yml
sudo k3s kubectl apply -f service.yml
sudo k3s kubectl apply -f ingress.yml


docker image url:
https://hub.docker.com/repository/docker/0crash0/opc-server-3dpr/general