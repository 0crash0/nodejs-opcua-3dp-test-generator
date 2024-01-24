# nodejs-opcua-3dp-test-generator

sudo k3s kubectl create secret docker-registry registrysecret
--docker-server='https://index.docker.io/v1/'
--docker-username='<ИМЯ ПОЛЬЗОВАТЕЛЯ DOCKER HUB>'
--docker-password='<ПАРОЛЬ ПОЛЬЗОВАТЕЛЯ DOCKER HUB>'

sudo k3s kubectl apply -f deployment.yml
sudo k3s kubectl apply -f service.yml
sudo k3s kubectl apply -f ingress.yaml