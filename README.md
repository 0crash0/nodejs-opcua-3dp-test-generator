# Test data generator for opc ua interface
### simulator of 3d printer and setting parameters at OPC UA and rest api
## docker and kubernetes ready

```
docker login --username username
docker-compoe --bulid
docker-compose up
```

```
sudo k3s kubectl create secret docker-registry registrysecret
--docker-server='https://index.docker.io/v1/'
--docker-username='<user>'
--docker-password='<pass>'
```

```
sudo k3s kubectl apply -f deployment.yml
sudo k3s kubectl apply -f service.yml
sudo k3s kubectl apply -f ingress.yml
```

### docker image url:
https://hub.docker.com/repository/docker/0crash0/opc-server-3dpr/general


### things for nifi for working on ziiot platform:

| template                | README                                 |
|-------------------------|----------------------------------------|
| nifi processor template | [3dp_test_gen_template_rest.xml][nifiTplt] |
| nifi processor group    | [try_to_get_my_rest.json][nifiGrp]        |


### nifi opc ua processors(cloned to nifi-lib in this repo):
https://github.com/linksmart/nifi-opc-ua-bundles  

opc-ua-stack-1.3.343.jar is requiered for building nifi-opcua.nar


[nifiTplt]: <https://github.com//README.md>
[nifiGrp]: <https://github.com//README.md>
